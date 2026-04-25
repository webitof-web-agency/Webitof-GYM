import Notice from "../models/notice.model";
import Group from "../models/group.models";
import User from "../models/user.model";
import Order from "../models/product/order.model";
import UserSubscription from "../models/userSubscription.model";
import Product from "../models/product/product.model";

type DateRangeQuery = {
  from?: string | string[];
  to?: string | string[];
};

const getFirstQueryValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const getDateRangeFromQuery = (query: DateRangeQuery = {}) => {
  const from = getFirstQueryValue(query.from);
  const to = getFirstQueryValue(query.to);
  const createdAt: any = {};

  if (from) {
    const fromDate = new Date(from as string);
    if (!isNaN(fromDate.getTime())) {
      fromDate.setHours(0, 0, 0, 0);
      createdAt.$gte = fromDate;
    }
  }

  if (to) {
    const toDate = new Date(to as string);
    if (!isNaN(toDate.getTime())) {
      toDate.setHours(23, 59, 59, 999);
      createdAt.$lte = toDate;
    }
  }

  if (createdAt.$gte && createdAt.$lte && createdAt.$gte > createdAt.$lte) {
    return { error: true, msg: "Invalid date range. 'from' cannot be after 'to'." };
  }

  return { error: false, createdAt: Object.keys(createdAt).length ? createdAt : null };
};

const getGroupLabelFormat = (groupBy: string) => {
  if (groupBy === "day") return "%Y-%m-%d";
  if (groupBy === "week") return "%G-W%V";
  return "%Y-%m";
};


export const getTrainerDashboard = async (req, res) => {
    try {
        const user = res.locals.user._id;

        if (!user) {
            return res.status(400).json({
                error: true,
                msg: 'User not found'
            });
        }

        const groups = await Group.find({
            assign_trainers: user
        }).populate({
            path: 'members',
            select: 'name email phone image _id'
        }).limit(5);
       
        


        const totalNotice = await Notice.find({ user: user }).countDocuments();
        const totalGroup = await Group.find({ assign_trainers: user }).countDocuments();

        return res.status(200).json({
            error: false,
            msg: 'Successfully fetched data',
            data: {
                groups,
                totalNotice,
                totalGroup
            }
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: 'Internal server error'
        });
    }
};


export const getAdminDashboard = async (req, res) => {
  try {
    const user = res.locals.user._id;

    if (!user) {
      return res.status(400).json({
        error: true,
        msg: "User not found",
      });
    }

    const [
      totalUsers,
      totalTrainers,
      totalEmployee,
      totalGroups,
      totalOrders,
      totalPaidSubscription,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "trainer" }),
      User.countDocuments({ role: "employee" }),
      Group.countDocuments({}),
      Order.countDocuments({}),
      UserSubscription.countDocuments({ active: true }),
    ]);

    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 1,
          name: "$productDetails.name",
          thumbnail_image: "$productDetails.thumbnail_image",
          price: "$productDetails.price",
          totalSold: 1,
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]);

    const topTrainers = await User.find({ role: "trainer" })
      .sort({ createdAt: 1 })
      .limit(6)
      .select("name image role _id");
    const activeMembers = await User.find({ role: "user" })
      .sort({ createdAt: 1 })
      .limit(6)
      .select("name image role _id");
    const latestOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .select("uid subTotal _id createdAt payment");
    const latestSubscriptionHistory = await UserSubscription.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .select("uid _id createdAt payment");

    const salesData = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalOrderedQuantity: { $sum: "$items.quantity" },
        },
      },
    ]);

    const totalSaleCount = salesData.reduce(
      (total, sale) => total + sale.totalOrderedQuantity,
      0
    );

    const totalExistsQuantity = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $project: {
          _id: 0,
          totalQuantity: 1,
        },
      },
    ]);
    const totalExistingQuantity = totalExistsQuantity?.[0]?.totalQuantity || 0;

    const currentYear = new Date().getFullYear();
    const monthlyEarnings = await Promise.all(
      Array.from({ length: 12 }, async (_, month) => {
        const start = new Date(currentYear, month, 1);
        const end = new Date(currentYear, month + 1, 0);

        const completedOrders = await Order.aggregate([
          {
            $match: {
              status: "completed",
              createdAt: { $gte: start, $lt: end },
            },
          },
          { $group: { _id: null, total: { $sum: "$subTotal" } } },
        ]);

        const subscriptions = await UserSubscription.aggregate([
          {
            $match: {
              createdAt: { $gte: start, $lt: end },
            },
          },
          { $group: { _id: null, total: { $sum: "$payment" } } },
        ]);

        return {
          month: month + 1,
          earnings:
            (completedOrders[0]?.total || 0) + (subscriptions[0]?.total || 0),
        };
      })
    );

    return res.status(200).json({
      error: false,
      msg: "Successfully fetched dashboard data",
      data: {
        totalUsers,
        totalTrainers,
        totalEmployee,
        totalGroups,
        totalOrders,
        totalPaidSubscription,
        topProducts,
        topTrainers,
        activeMembers,
        latestOrders,
        latestSubscriptionHistory,
        salesData: {
          existingProduct: totalExistingQuantity,
          totalProduct: totalSaleCount + totalExistingQuantity,
          soldProduct: totalSaleCount,
        },
        monthlyEarnings,
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    return res.status(500).json({
      error: true,
      msg: "Internal server error",
      errorDetails:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getAdminRevenueAnalytics = async (req, res) => {
  try {
    const { groupBy = "month", source = "both", status = "completed" } = req.query;
    const validGroupBy = ["day", "week", "month"].includes(groupBy) ? groupBy : "month";
    const validSource = ["orders", "subscriptions", "both"].includes(source)
      ? source
      : "both";

    const dateRange = getDateRangeFromQuery(req.query);
    if (dateRange.error) {
      return res.status(400).json({ error: true, msg: dateRange.msg });
    }

    const labelFormat = getGroupLabelFormat(validGroupBy);
    const includeOrders = validSource === "orders" || validSource === "both";
    const includeSubscriptions = validSource === "subscriptions" || validSource === "both";

    const orderMatch: any = {};
    if (dateRange.createdAt) orderMatch.createdAt = dateRange.createdAt;
    if (status && status !== "all") orderMatch.status = status;

    const subscriptionMatch: any = {
      "payment.status": { $in: ["paid", "partial"] },
    };
    if (dateRange.createdAt) subscriptionMatch.createdAt = dateRange.createdAt;

    const [orderRevenueSeries, subscriptionRevenueSeries] = await Promise.all([
      includeOrders
        ? Order.aggregate([
            { $match: orderMatch },
            {
              $group: {
                _id: { $dateToString: { format: labelFormat, date: "$createdAt" } },
                value: { $sum: "$subTotal" },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ])
        : Promise.resolve([]),
      includeSubscriptions
        ? UserSubscription.aggregate([
            { $match: subscriptionMatch },
            {
              $group: {
                _id: { $dateToString: { format: labelFormat, date: "$createdAt" } },
                value: {
                  $sum: {
                    $ifNull: [
                      "$payment.paid_amount",
                      { $ifNull: ["$payment.amount", "$price"] },
                    ],
                  },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ])
        : Promise.resolve([]),
    ]);

    const merged = new Map();

    orderRevenueSeries.forEach((item) => {
      const existing = merged.get(item._id) || {
        label: item._id,
        earnings: 0,
        orderRevenue: 0,
        subscriptionRevenue: 0,
        orderCount: 0,
        subscriptionCount: 0,
      };
      existing.earnings += item.value || 0;
      existing.orderRevenue += item.value || 0;
      existing.orderCount += item.count || 0;
      merged.set(item._id, existing);
    });

    subscriptionRevenueSeries.forEach((item) => {
      const existing = merged.get(item._id) || {
        label: item._id,
        earnings: 0,
        orderRevenue: 0,
        subscriptionRevenue: 0,
        orderCount: 0,
        subscriptionCount: 0,
      };
      existing.earnings += item.value || 0;
      existing.subscriptionRevenue += item.value || 0;
      existing.subscriptionCount += item.count || 0;
      merged.set(item._id, existing);
    });

    const chartData = Array.from(merged.values()).sort((a, b) =>
      a.label > b.label ? 1 : -1
    );

    const summary = chartData.reduce(
      (acc, item) => {
        acc.totalRevenue += item.earnings || 0;
        acc.orderRevenue += item.orderRevenue || 0;
        acc.subscriptionRevenue += item.subscriptionRevenue || 0;
        acc.orderCount += item.orderCount || 0;
        acc.subscriptionCount += item.subscriptionCount || 0;
        return acc;
      },
      {
        totalRevenue: 0,
        orderRevenue: 0,
        subscriptionRevenue: 0,
        orderCount: 0,
        subscriptionCount: 0,
      }
    );

    return res.status(200).json({
      error: false,
      msg: "Successfully fetched revenue analytics",
      data: {
        filters: {
          groupBy: validGroupBy,
          source: validSource,
          status: status || "all",
          from: req.query.from || null,
          to: req.query.to || null,
        },
        summary,
        chartData,
      },
    });
  } catch (error) {
    console.error("Admin Revenue Analytics Error:", error);
    return res.status(500).json({
      error: true,
      msg: "Internal server error",
    });
  }
};

export const getAdminSalesAnalytics = async (req, res) => {
  try {
    const { status = "all", metric = "quantity" } = req.query;
    const limit = Math.max(3, Math.min(25, Number(req.query.limit) || 8));
    const metricKey = metric === "amount" ? "soldAmount" : "soldQuantity";

    const dateRange = getDateRangeFromQuery(req.query);
    if (dateRange.error) {
      return res.status(400).json({ error: true, msg: dateRange.msg });
    }

    const matchOrders: any = {};
    if (dateRange.createdAt) matchOrders.createdAt = dateRange.createdAt;
    if (status && status !== "all") matchOrders.status = status;

    const [soldByProduct, soldByCategory, orderTotals, totalExistsQuantity, statusBreakdown] =
      await Promise.all([
        Order.aggregate([
          { $match: matchOrders },
          { $unwind: "$items" },
          {
            $group: {
              _id: "$items.productId",
              soldQuantity: { $sum: "$items.quantity" },
              soldAmount: { $sum: "$items.total" },
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "_id",
              foreignField: "_id",
              as: "product",
            },
          },
          { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: "productcategories",
              localField: "product.category",
              foreignField: "_id",
              as: "category",
            },
          },
          { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
          {
            $project: {
              _id: 1,
              soldQuantity: 1,
              soldAmount: 1,
              name: "$product.name",
              thumbnail_image: "$product.thumbnail_image",
              categoryName: "$category.name",
            },
          },
          { $sort: { [metricKey]: -1 } },
          { $limit: limit },
        ]),
        Order.aggregate([
          { $match: matchOrders },
          { $unwind: "$items" },
          {
            $lookup: {
              from: "products",
              localField: "items.productId",
              foreignField: "_id",
              as: "product",
            },
          },
          { $unwind: { path: "$product", preserveNullAndEmptyArrays: false } },
          {
            $group: {
              _id: "$product.category",
              soldQuantity: { $sum: "$items.quantity" },
              soldAmount: { $sum: "$items.total" },
            },
          },
          {
            $lookup: {
              from: "productcategories",
              localField: "_id",
              foreignField: "_id",
              as: "category",
            },
          },
          { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
          {
            $project: {
              _id: 1,
              soldQuantity: 1,
              soldAmount: 1,
              categoryName: "$category.name",
            },
          },
          { $sort: { [metricKey]: -1 } },
          { $limit: 10 },
        ]),
        Order.aggregate([
          { $match: matchOrders },
          {
            $group: {
              _id: null,
              soldProduct: { $sum: { $sum: "$items.quantity" } },
              soldAmount: { $sum: "$subTotal" },
              orderCount: { $sum: 1 },
            },
          },
        ]),
        Product.aggregate([
          {
            $group: {
              _id: null,
              totalQuantity: { $sum: "$quantity" },
            },
          },
        ]),
        Order.aggregate([
          { $match: matchOrders },
          { $group: { _id: "$status", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
      ]);

    const soldProduct = orderTotals?.[0]?.soldProduct || 0;
    const soldAmount = orderTotals?.[0]?.soldAmount || 0;
    const orderCount = orderTotals?.[0]?.orderCount || 0;
    const existingProduct = totalExistsQuantity?.[0]?.totalQuantity || 0;

    return res.status(200).json({
      error: false,
      msg: "Successfully fetched sales analytics",
      data: {
        filters: {
          status: status || "all",
          metric: metricKey === "soldAmount" ? "amount" : "quantity",
          limit,
          from: req.query.from || null,
          to: req.query.to || null,
        },
        summary: {
          soldProduct,
          existingProduct,
          totalProduct: soldProduct + existingProduct,
          soldAmount,
          orderCount,
        },
        soldByProduct,
        soldByCategory,
        statusBreakdown,
      },
    });
  } catch (error) {
    console.error("Admin Sales Analytics Error:", error);
    return res.status(500).json({
      error: true,
      msg: "Internal server error",
    });
  }
};

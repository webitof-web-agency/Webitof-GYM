'use client'
import { useRouter } from "next/navigation";
import { RiAddCircleLine } from "react-icons/ri";
import { useFetch } from "../../../../../helpers/hooks";
import { delNutrition, fetchNutrition, } from "../../../../../helpers/backend";
import { useI18n } from "../../../../../providers/i18n";
import TrainerTable from "../../../../../../components/form/trainerTable";
import dayjs from "dayjs";
import { Avatar } from "antd";
import Button from "../../../../../../components/common/button";
import { columnFormatter } from "../../../../../helpers/utils";
const page = () => {
  const router = useRouter();
  const [data, getData] = useFetch(fetchNutrition)
  const i18n = useI18n();

  const columns = [
    {
      text: i18n?.t("Start Date"),
      dataField: "start_date",
      formatter: (_, d) => <span>{dayjs(d?.start_date).format('DD/MM/YYYY')}</span>,
    },
    {
      text: i18n?.t("End Date"),
      dataField: "end_date",
      formatter: (_, d) => <span>{dayjs(d?.end_date).format('DD/MM/YYYY')}</span>,
    },
    {
      text: i18n?.t("Group"),
      dataField: "groups",
      formatter: (_, d) => <span>{columnFormatter(d?.group?.name) || "N/A"}</span>,
    },
    {
      text: i18n?.t("Members"),
      dataField: "members",
      formatter: (_, d) => <span>{
        d?.members &&
        (
          <Avatar.Group max={3}>
            {
              d?.members?.slice(0, 3)?.map((item, index) => (
                <div key={index} className="flex space-x-1">
                  <Avatar src={item?.image ? item?.image : "/defaultimg.jpg"} />
                </div>
              ))
            }
          </Avatar.Group>
        )

      }</span>,
    },

  ];
  return (
    <div className="bg-white">
      <div className='flex justify-end mb-6'>
        <Button
          onClick={() => router.push('/trainer/nutrition-schedule/add-nutrition')}
          type="button"
          className="!py-2.5 !px-6 !h-fit flex items-center gap-[10px] rounded-xl shadow-sm text-[14.5px] font-medium transition-transform hover:-translate-y-0.5"
        >
          <RiAddCircleLine className="text-lg" />
          {i18n?.t("Add Nutrition")}
        </Button>
      </div>
      

      <div className="w-full overflow-x-auto">
        <TrainerTable
          data={data}
          columns={columns}
          onReload={getData}
          pagination
          onEdit={(data) => router.push(`/trainer/nutrition-schedule/edit/${data?._id}`)}
          onView={(data) => router.push(`/trainer/nutrition-schedule/view/${data?._id}`)}
          onDelete={delNutrition}
          noHeader
        />
      </div>
    </div>
  )
}

export default page

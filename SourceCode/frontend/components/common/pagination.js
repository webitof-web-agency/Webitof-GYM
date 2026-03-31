import ReactPaginate from "react-paginate";
import { useI18n } from "../../app/providers/i18n";

const Pagination = ({ page, total, limit, totalPages, onPageChange, onSizeChange }) => {
    const i18n = useI18n();
    return (
        <div className="flex flex-wrap justify-between mb-2 gap-x-3">
            <div className="flex items-center !mb-6 md:!mb-0 ">
                {onSizeChange && (
                    <div className="flex items-center mr-3 text-sm text-dark_text h-[24px]">
                        {("Show")}
                        <select value={limit} onChange={(e) => {
                            onSizeChange(+e.target.value)
                        }} className="h-[24px] px-1 rounded mx-2 text-center focus:outline-0">
                            <option value={10}>{("10")}</option>
                            <option value={25}>{("25")}</option>
                            <option value={50}>{("50")}</option>
                            <option value={100}>{("100")}</option>
                        </select>
                    </div>
                )}
                <p className="text-sm text-dark_text">
                    {("Showing")} {((page - 1) * limit) + 1 || 0}
                    &nbsp;{("to")} {Math.min(total || 0, (page * limit) || 0)} {("of")} {total || 0} {("entries")}
                </p>
            </div>

            <ReactPaginate
                breakLabel="..."
                previousLabel={i18n?.t("Previous")}
                disabledLinkClassName="dashboard-pagination-link dashboard-pagination-link-disabled"
                previousLinkClassName="dashboard-pagination-link dashboard-pagination-edge"
                nextLinkClassName="dashboard-pagination-link dashboard-pagination-edge"
                pageLinkClassName="dashboard-pagination-link"
                pageClassName="!mb-3 md:!mb-0"
                activeLinkClassName="dashboard-pagination-link-active"
                nextLabel={i18n?.t("Next")}
                className="dashboard-pagination flex flex-wrap"
                onPageChange={({ selected }) => onPageChange(selected + 1)}
                pageRangeDisplayed={3}
                pageCount={totalPages || 1}
                renderOnZeroPageCount={null}
            />
        </div>
    )
}
export default Pagination

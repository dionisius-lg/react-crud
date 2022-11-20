import classnames from "classnames";
import { PaginationDots, PaginationRange, PaginationInfo } from "../helpers/pagination";

const Pagination = ({ changePage, total, limit, paging, sibling = 1 }) => {
    let numDots = 0
    const { current, first, last, previous, next } = paging
    const pageRange = PaginationRange({ total, limit, current, sibling })
    const pagingInfo = PaginationInfo({ total, limit, current })

    return (
        <>
            <div key="pagingInfo" className="py-2 border-top">
                Showing { pagingInfo.lowest } to { pagingInfo.highest } of { pagingInfo.total } entries
            </div>
            <nav className={ classnames('float-right', {'d-none': current === 0 || pageRange.length < 2}) }>
                <ul className="pagination mb-0 pb-0">
                    <li key="previous" className={ classnames('page-item', {'d-none': current === first}) }>
                        <button type="button" className="page-link" onClick={() => changePage(previous)}>Prev</button>
                    </li>

                    { pageRange.map(pageNumber => {
                        if (pageNumber === PaginationDots) {
                            numDots++

                            return (
                                <li key={`pageDots${numDots}`} className="page-item disabled">
                                    <span className="page-link">&#8230;</span>
                                </li>
                            )
                        }

                        return (
                            <li key={`pageNumber${pageNumber}`} className={ classnames('page-item', {'active': pageNumber === current}) }>
                                {pageNumber === current ?
                                    <span className="page-link asd">{pageNumber}</span>
                                    :
                                    <button type="button" className="page-link" onClick={() => changePage(pageNumber)}>{pageNumber}</button>
                                }
                            </li>
                        )
                    })}

                    <li key="next" className={ classnames('page-item', {'d-none': current === last}) }>
                        <button type="button" className="page-link" onClick={() => changePage(next)}>Next</button>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Pagination

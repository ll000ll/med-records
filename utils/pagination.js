const { ITEMS_PER_PAGE } = require("../constants")

module.exports = (page, totalItems) => {
  const lastPage = Math.ceil(totalItems / ITEMS_PER_PAGE)
  return {
    totalUsers: totalItems,
    hasNextPage: totalItems > ITEMS_PER_PAGE * page,
    hasPreviousPage: page > 1,
    currentPage: page,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage,
    lastPageRendered: lastPage !== page && page + 1 !== lastPage,
    firstPageRendered: page > 1 && page - 1 !== 1,
  }
}

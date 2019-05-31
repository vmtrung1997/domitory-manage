export const get_month = () => {
  return [...Array(13)].map((_, i) => { return i === 0 ? { value: i, label: 'Tất cả' } : { value: i, label: i } })
}
export const get_year_db = (yearArr) => {
  let yearNow = (new Date).getFullYear();
  let minYear = yearArr?Math.min(...yearArr):yearNow;
  return [...Array(yearNow - minYear + 1)].map((_, i) => { return i === 0 ? { value: i, label: 'Tất cả' } : { value: i + minYear -1, label: i + minYear -1 } })
}

export const get_status = () => {
  return [
    { value: 2, label: 'Tất cả' },
    { value: 1, label: 'Đã thanh toán' },
    { value: 0, label: 'Chưa thanh toán' }]
}
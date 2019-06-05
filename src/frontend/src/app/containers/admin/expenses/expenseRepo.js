export const get_month = () => {
  return [...Array(13)].map((_, i) => { return i === 0 ? { value: i, label: 'Tất cả' } : { value: i, label: i } })
}
export const get_year_db = (yearArr) => {
  let yearNow = (new Date).getFullYear();
  let minYear = yearArr.length>0?Math.min(...yearArr):yearNow;
  if (minYear != yearNow)
    return [...Array(yearNow - minYear + 2)].map((_, i) => { return i === 0 ? { value: i, label: 'Tất cả' } : { value: yearNow - i +1, label: yearNow - i +1 } })
  else
  return [{ value: 0, label: 'Tất cả' }, { value: minYear, label: minYear }]
}

export const get_status = () => {
  return [
    { value: 2, label: 'Tất cả' },
    { value: 1, label: 'Đã thanh toán' },
    { value: 0, label: 'Chưa thanh toán' }]
}
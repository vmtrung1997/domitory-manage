export const get_month = () => {
  return [...Array(13)].map((_, i) => { return i === 0 ? { value: i, label: 'Tất cả' } : { value: i, label: i } })
}
export const get_year = () => {
  return [...Array(4)].map((_, i) => { return i === 0 ? { value: i, label: 'Tất cả' } : { value: i + 2014, label: i + 2014 } });
}
export const get_status = () => {
  return [
    { value: 2, label: 'Tất cả' },
    { value: 1, label: 'Đã thanh toán' },
    { value: 0, label: 'Chưa thanh toán' }]
}
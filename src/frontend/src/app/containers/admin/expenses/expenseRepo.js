export const get_month = () => {
  return [...Array(13)].map((_, i) => { return i === 0 ? { value: i, label: 'Tất cả' } : { value: i, label: i } })
}
export const get_year = () => {
  var today = (new Date()).getFullYear() - 3;
  console.log(today);
  return [...Array(4)].map((_, i) => { return i === 0 ? { value: i, label: 'Tất cả' } : { value: i + today, label: i + today } });
}
export const get_status = () => {
  return [
    { value: 2, label: 'Tất cả' },
    { value: 1, label: 'Đã thanh toán' },
    { value: 0, label: 'Chưa thanh toán' }]
}
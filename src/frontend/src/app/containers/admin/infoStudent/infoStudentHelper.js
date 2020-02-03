export const ensureInfoStudentDetail = (data) => {
  const empty = {
    _id: '',
    idTaiKhoan: {},
    hoTen: '',
    MSSV: '',
    CMND: '',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfQ1VAlKwxbHKlI-K2auBgRM4fYSBd-MJDyc3CnbkbpJnvdUNx',
    gioiTinh: 0,
    ngayHetHan: '',
    ngayDangKy: '',
    email: '',
    sdt: '',
    sdtNguoiThan: '',
    danToc: '',
    diaChi: '',
    maThe: '',
    truong: {},
    nganhHoc: {},
    moTa: '',
    isActive: false,
    flag: true,
    idPhong: {},
  };
  return { ...empty, ...data };
};

//infoUser
const initialState = {
    MSSV: undefined,
    danToc: undefined,
    diaChi: undefined,
    email: undefined,
    gioiTinh: undefined,
    hoTen: undefined,
    idPhong: { _id: undefined, tenPhong: undefined },
    idTaiKhoan: undefined,
    maThe: undefined,
    moTa: undefined,
    nganhHoc: { _id: undefined, tenNganh: undefined },
    ngayHetHan: undefined,
    ngaySinh: undefined,
    ngayVaoO: undefined,
    sdt: undefined,
    sdtNguoiThan: undefined,
    truong: { _id: undefined, tenTruong: undefined },
    _id: undefined
}

export default function UserProfile(state = initialState, action) {
    switch (action.type) {
        
        case 'GET_USER_INFO':
            return (
                {
                    ...action.payload
                });
        default:
            return state;
    }
}
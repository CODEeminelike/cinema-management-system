import * as dotenv from 'dotenv';
dotenv.config();

export const APP_CONSTANTS = {
  PORT: 3333,
  API_PREFIX: '/api',
  SUB_ROUTES: {
    RAP: 'QuanLyRap',
    DAT_VE: 'QuanLyDatVe',
    PHIM: 'QuanLyPhim',
    NGUOI_DUNG: 'QuanLyNguoiDung',
  },
  ROLES: {
    ADMIN: 'ADMIN',
    USER: 'USER',
  },
} as const;

//console.log(APP_CONSTANTS);

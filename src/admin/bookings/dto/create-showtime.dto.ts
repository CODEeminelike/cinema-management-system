import { IsInt, IsDateString, IsPositive, Min } from 'class-validator';

export class CreateShowtimeDto {
  @IsInt({ message: 'Mã phim phải là số nguyên' })
  @IsPositive({ message: 'Mã phim phải là số dương' })
  ma_phim!: number;

  @IsInt({ message: 'Mã rạp phải là số nguyên' })
  @IsPositive({ message: 'Mã rạp phải là số dương' })
  ma_rap!: number;

  @IsDateString(
    {},
    { message: 'Ngày giờ chiếu phải là định dạng ngày tháng hợp lệ' },
  )
  ngay_gio_chieu!: string;

  @IsInt({ message: 'Giá vé phải là số nguyên' })
  @Min(0, { message: 'Giá vé không được nhỏ hơn 0' })
  gia_ve!: number;
}

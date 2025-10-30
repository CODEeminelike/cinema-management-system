import {
  IsInt,
  IsPositive,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  ArrayMinSize,
} from 'class-validator';

export class CreateBookingDto {
  @IsInt({ message: 'Mã lịch chiếu phải là số nguyên' })
  @IsPositive({ message: 'Mã lịch chiếu phải là số dương' })
  ma_lich_chieu!: number;

  @IsArray({ message: 'Danh sách ghế phải là mảng' })
  @ArrayNotEmpty({ message: 'Danh sách ghế không được rỗng' })
  @ArrayUnique({ message: 'Ghế không được trùng lặp' })
  @ArrayMinSize(1, { message: 'Phải chọn ít nhất 1 ghế' })
  danh_sach_ma_ghe!: number[]; // Danh sách mã ghế
}

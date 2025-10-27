
import { Module } from "@nestjs/common";
import { TheaterController } from "./theater.controller";


@Module({
    imports: [],
    controllers:[TheaterController],
    exports:  []
})
export class TheaterModule{}
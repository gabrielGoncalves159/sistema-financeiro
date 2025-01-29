import { PartialType } from "@nestjs/mapped-types";
import { CreateTransactionDto } from "src/modules/transaction/dto/create-transaction-dto";

export class UpdateUserDto extends PartialType(CreateTransactionDto) {}
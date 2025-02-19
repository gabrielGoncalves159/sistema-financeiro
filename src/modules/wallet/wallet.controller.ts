import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserService } from '../user/user.service';
import { CreateWalletDto } from './dto/create-wallet-dto';
import { Wallet } from 'src/entities/wallet.entity';
import { UpdateWalletDto } from './dto/update-wallet-dto';
import { WalletDto } from './dto/waller-dto';

@Controller('wallet')
export class WalletController {
    userService: UserService;
    constructor(private readonly walletService: WalletService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createWallet(
        @Body() dto: CreateWalletDto ,
    ) : Promise<Wallet | null> {
        return this.walletService.createWallet(dto);
    }

    // @UseGuards(JwtAuthGuard)
    // @Get(':userId')
    // async getWalletsByUserId(@Param('userId') userId: number) : Promise<Wallet[]> {
    //     return this.walletService.findAllWallet(userId);
    // }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateWallet(
        @Param('id') id: number,
        @Body() updateData: Partial<UpdateWalletDto>
    ) : Promise<WalletDto> {
        return this.walletService.updateWallet(id, updateData);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteWallet(@Param('id') id: number) : Promise<void> {
        return this.walletService.deleteWallet(id);
    }

    // @UseGuards(JwtAuthGuard)
    // @Get('balance/:userId')
    // async getUserBalance(@Param('userId') userId: number): Promise<number> {
    //   return this.walletService.getUserBalance(userId);
    // }
}

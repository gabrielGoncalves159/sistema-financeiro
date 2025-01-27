import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Wallet } from './wallet.entity';
import { JwtAuthGuard } from 'src/auth/shared/jwt-auth.guard';
import { UserService } from '../user/user.service';

@Controller('wallet')
export class WalletController {
    userService: UserService;
    constructor(private readonly walletService: WalletService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createWallet(
        @Body('name') name: string,
        @Request() req: any,
    ) : Promise<Wallet | null> {
        const user = await this.userService.findUserById(req.user.id);
        return this.walletService.createWallet(name, user!.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId')
    async getWalletsByUserId(@Param('userId') userId: number) : Promise<Wallet[]> {
        return this.walletService.findAllWallet(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateWallet(
        @Param('id') id: number,
        @Body() updateData: Partial<Wallet>
    ) : Promise<Wallet> {
        return this.walletService.updateWallet(id, updateData);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteWallet(@Param('id') id: number) : Promise<void> {
        return this.walletService.deleteWallet(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('balance/:userId')
    async getUserBalance(@Param('userId') userId: number): Promise<number> {
      return this.walletService.getUserBalance(userId);
    }
}

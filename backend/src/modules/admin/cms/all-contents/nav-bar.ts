import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NavBarTbl } from '../entities/nav-bar-tbl';

@Injectable()
export class NavBarService {
  constructor(
    @InjectRepository(NavBarTbl)
    private readonly navBarRepository: Repository<NavBarTbl>,
  ) {}

  async getAllNavbars() {
    return this.navBarRepository.find({ relations: { navLinks: true } });
  }

  async createNavBar(navBarName: string) {
    const newNavBar = this.navBarRepository.create({ navBarName });
    return this.navBarRepository.save(newNavBar);
  }

  async updateNavBar(navBarId: number, navBarName: string) {
    const navBar = await this.navBarRepository.findOne({
      where: { navBarId },
    });
    if (!navBar) {
      throw new Error('NavBar not found');
    }
    navBar.navBarName = navBarName;
    return this.navBarRepository.save(navBar);
  }

  async deleteNavBar(navBarId: number) {
    const navBar = await this.navBarRepository.findOne({
      where: { navBarId },
    });
    if (!navBar) {
      throw new Error('NavBar not found');
    }
    return this.navBarRepository.remove(navBar);
  }
}

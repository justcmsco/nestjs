import { DynamicModule, Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JustCmsService, JustCmsModuleOptions } from './justcms.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [JustCmsService],
  exports: [JustCmsService],
})
export class JustCmsModule {
  static forRoot(options?: JustCmsModuleOptions): DynamicModule {
    return {
      module: JustCmsModule,
      providers: [
        {
          provide: 'JUST_CMS_OPTIONS',
          useValue: options || {},
        },
        JustCmsService,
      ],
      exports: [JustCmsService],
    };
  }
}
import { Injector } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { LocalizationService } from '@abp/localization/localization.service';
import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { FeatureCheckerService } from '@abp/features/feature-checker.service';
import { NotifyService } from '@abp/notify/notify.service';
import { SettingService } from '@abp/settings/setting.service';
import { MessageService } from '@abp/message/message.service';
import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { PrimengDatatableHelper } from 'shared/helpers/PrimengDatatableHelper';
import { AppUiCustomizationService } from '@shared/common/ui/app-ui-customization.service';
import { Moment } from 'moment';
import * as moment from 'moment';

export class ModalProperty {
    edit: boolean
    id: number
    name: string
}

export abstract class AppComponentBase {

    localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;

    localization: LocalizationService;
    permission: PermissionCheckerService;
    feature: FeatureCheckerService;
    notify: NotifyService;
    setting: SettingService;
    message: MessageService;
    multiTenancy: AbpMultiTenancyService;
    appSession: AppSessionService;
    primengDatatableHelper: PrimengDatatableHelper;
    ui: AppUiCustomizationService;

    constructor(injector: Injector) {
        this.localization = injector.get(LocalizationService);
        this.permission = injector.get(PermissionCheckerService);
        this.feature = injector.get(FeatureCheckerService);
        this.notify = injector.get(NotifyService);
        this.setting = injector.get(SettingService);
        this.message = injector.get(MessageService);
        this.multiTenancy = injector.get(AbpMultiTenancyService);
        this.appSession = injector.get(AppSessionService);
        this.ui = injector.get(AppUiCustomizationService);
        this.primengDatatableHelper = new PrimengDatatableHelper();
    }

    l(key: string, ...args: any[]): string {
        return this.ls(this.localizationSourceName, key, args);
    }

    ls(sourcename: string, key: string, ...args: any[]): string {
        let localizedText = this.localization.localize(key, sourcename);

        if (!localizedText) {
            localizedText = key;
        }

        if (!args || !args.length) {
            return localizedText;
        }

        args[0].unshift(localizedText);

        return abp.utils.formatString.apply(this, args[0]);
    }

    isGranted(permissionName: string): boolean {
        return this.permission.isGranted(permissionName);
    }

    isGrantedAny(...permissions: string[]): boolean {
        if (!permissions) {
            return false;
        }

        for (const permission of permissions) {
            if (this.isGranted(permission)) {
                return true;
            }
        }

        return false;
    }

    s(key: string): string {
        return abp.setting.get(key);
    }

    //== CUSTOM FUNC =====================================
    isEmptyValue(n): boolean {
        if (n === undefined || n === null || n === '' || n === 0)
            return true;
        else
            return false;
    }

    daysBetween = function (startDate, endDate) {
        // Convert both dates to milliseconds
        var startDate_ms = startDate.getTime();
        var endDate_ms = endDate.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = endDate_ms - startDate_ms;
        //take out milliseconds
        difference_ms = difference_ms / 1000;
        var seconds = Math.floor(difference_ms % 60);
        difference_ms = difference_ms / 60;
        var minutes = Math.floor(difference_ms % 60);
        difference_ms = difference_ms / 60;
        var hours = Math.floor(difference_ms % 24);
        var days = Math.floor(difference_ms / 24);

        var diff = '';
        if (days != 0) diff += days + ' days, ';
        if (hours != 0) diff += hours + ' hours, ';
        if (minutes != 0) diff += minutes + ' minutes, ';

        diff += seconds + ' seconds ';

        return diff;
    }

    //NOTE: This method only cover date with / or - separator
    strToMoment(date: string, format: string = 'dd/mm/yyyy', isDatetime: boolean = false): Moment {
        let separator = date.indexOf('-') != -1 ? '-' : '/';
        let splitDate: string[];
        let formattedDate: Date;
        let splitTime: string = '';

        if(isDatetime) {
            let idxSpace = date.indexOf(' ')
            splitDate = date.substr(0, idxSpace).split(separator);
            splitTime = date.substr(idxSpace);
        } else {
            splitDate = date.split(separator);
        }
        
        if(format=='dd'+separator+'mm'+separator+'yyyy')
            formattedDate = new Date(splitDate[2]+'-'+splitDate[1]+'-'+splitDate[0]+splitTime);
        else if(format=='mm'+separator+'dd'+separator+'yyyy')
            formattedDate = new Date(splitDate[2]+'-'+splitDate[0]+'-'+splitDate[1]+splitTime);
        else
            formattedDate = new Date(splitDate[0]+'-'+splitDate[1]+'-'+splitDate[2]+splitTime);

        let dateInput = moment(formattedDate);
        return dateInput;
    }

    momentToStr(date: Moment): string {
        return date.format('DD/MM/YYYY');
    }

    momentToDateTimeStr(date: Moment): string {
        return date.format('DD/MM/YYYY hh:mm:ss A');
    }

    roundTo(n, digits) {
        if (digits === undefined) {
            digits = 0;
        }

        let multiplicator = Math.pow(10, digits);
        n = parseFloat((n * multiplicator).toFixed(11));
        let test = (Math.round(n) / multiplicator);
        return +(test.toFixed(digits));
    }

    currencyFormattedNumber(number, thousandsSeparator = ',', decimalSeparator = '.'): string {
        let parts = number.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
        return parts.join(decimalSeparator) + (parts.length === 1 ? decimalSeparator + '00' : (parts[1].length === 1 ? '0' : ''));
    }
}

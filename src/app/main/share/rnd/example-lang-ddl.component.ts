import { AfterContentInit, Component, ElementRef, forwardRef, ViewChild, Input } from '@angular/core';
import { BaseDropDownListComponent, getCustomInputControlValueAccessor, templateString } from '@app/main/share/base-ddl.component';

import { LanguageServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
    template: templateString,
    selector: 'example-lang-ddl',
    providers: [getCustomInputControlValueAccessor(ExampleLangDdlComponent), BaseDropDownListComponent]
})
export class ExampleLangDdlComponent extends BaseDropDownListComponent implements AfterContentInit {
    @ViewChild('dropdownElement', {read: ElementRef}) el;
    @Input() input;

    listResult;
    labelField = 'displayName';
    valueField = 'name';
    isLoading = true;

    constructor(
        private _languageService: LanguageServiceProxy,
    ) {
        super();
    }

    ngAfterContentInit() {
        this.setDropdownElement(this.el);
    }

    //CHANGE: Uncommented retrieveByInput() method if you use param for request service
    retrieveByInput() {
        if(this.input != undefined && this.input != '')
        {
            this.listResult = this._languageService.getLanguageForEdit(this.input);
        }
        else {
            this.listResult = undefined;
            this.loadAllData();
        }
    }
}
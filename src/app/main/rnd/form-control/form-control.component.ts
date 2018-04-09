import { Component, Injector, ElementRef, ViewChild } from '@angular/core';
import { AppComponentBase } from "@shared/common/app-component-base";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { appModuleAnimation } from 'shared/animations/routerTransition';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ValidationService } from 'app/shared/common/share/validation.service';

@Component({
    templateUrl: './form-control.component.html',
    animations: [appModuleAnimation()]
})

export class FormControlComponent extends AppComponentBase implements OnInit {

    validationForm: FormGroup;
    model: MSInputDto;

    @ViewChild('departmentCombo') departmentComboElement: ElementRef;
    
    constructor(
        injector: Injector,
        private _fb: FormBuilder
    ) {
        super(injector);
        this.validationForm = _fb.group({
            'positionName': [null, [Validators.required, Validators.maxLength(25)]],
            'positionCode': [null, [Validators.required, Validators.maxLength(3), ValidationService.alphaNumValidator]],
            'department': [null, Validators.required],
            'exampleShare': [null, Validators.required],
            'isActive': true
        });
    }

    ngOnInit(): void {
        this.model = new MSInputDto(); //this line for init model variable
        this.model.isActive = true;
        
        setTimeout(() => {
            $(this.departmentComboElement.nativeElement).selectpicker('refresh');
        }, 0);
    }

    save(): void {
        console.log(this.model);
    }
}

//This class is represent of DTO(for this demo only, you don't need to create this class in real development)
class MSInputDto {
    id: number;
    positionName: string;
    positionCode: string;
    departmentID: number;
    exampleShare: number;
    isActive: boolean;
}
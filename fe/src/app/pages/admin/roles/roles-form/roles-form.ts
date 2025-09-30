import { Component, Input, OnInit } from '@angular/core';
import { RolesService } from '../roles-service';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IRole } from '../../../../types/interfaces/user.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ROLES } from '../../../../types/constants/menus';
import { FormValidation } from '../../../../shared/directives/form-validation/form-validation';

type formType = 'new' | 'edit' | 'view';

@Component({
  selector: 'app-roles-form',
  imports: [ReactiveFormsModule, FormValidation],
  templateUrl: './roles-form.html',
  styleUrl: './roles-form.scss'
})
export class RolesForm implements OnInit {
  isLoading: boolean = false;
  @Input() type: formType = 'new';
  @Input() id?: string;

  columns = [
    {
      label: 'Module',
      id: 'module',
      extraHeaderClass: 'uppercase-text',
    },
    {
      label: 'View',
      id: 'view',
      extraHeaderClass: 'uppercase-text',
    },
    {
      label: 'Create',
      id: 'create',
      extraHeaderClass: 'uppercase-text',
    },
    {
      label: 'Edit',
      id: 'edit',
      extraHeaderClass: 'uppercase-text',
    },
    {
      label: 'Delete',
      id: 'delete',
      extraHeaderClass: 'uppercase-text',
    },
  ]


  form: FormGroup = new FormGroup({
    role_name: new FormControl(null, [Validators.required]),
    modules: new FormArray<FormGroup>([]),
    active: new FormControl(false)
  });

  get modules(): FormArray<FormGroup> {
    return this.form.get('modules') as FormArray<FormGroup>;
  }

  constructor(private roleService: RolesService, private route: ActivatedRoute, private router: Router) {
    this.id = this.route.snapshot.paramMap.get('role_id') || undefined;
    const type = this.route.snapshot.queryParamMap.get('type') || undefined;
    if (type && ['new', 'edit', 'view'].includes(type)) {
      this.type = type as formType;
    }
  }

  private buildModuleGroup(module: string): FormGroup {
    return new FormGroup({
      module: new FormControl(module),
      create: new FormControl(false),
      view: new FormControl(false),
      edit: new FormControl(false),
      delete: new FormControl(false),
    });
  }

  getModules() {
    this.isLoading = true;
    this.roleService.getModules().subscribe((res: string[]) => {
      const formArray = this.form.get('modules') as FormArray;
      formArray.clear();

      res.forEach((item) => {
        const [module, action] = item.split('.');
        let moduleGroup = formArray.controls.find(
          (ctrl) => ctrl.get('module')?.value === module
        ) as FormGroup;

        if (!moduleGroup) {
          moduleGroup = this.buildModuleGroup(module);
          formArray.push(moduleGroup);
        }
      });

      this.isLoading = false;
      if (this.id) {
        this.getDetail(this.id);
      }
    });
  }



  getDetail(id: string) {
    this.isLoading = true;
    this.roleService.getRole(id).subscribe((res) => {
      this.form.controls.role_name.patchValue(res.role_name);
      this.form.controls.active.patchValue(res.active);
      const formArray = this.form.get('modules') as FormArray;
      res.modules.forEach((item) => {
        const [module, action] = item.split('.');
        let moduleGroup = formArray.controls.find(
          (ctrl) => ctrl.get('module')?.value === module
        ) as FormGroup;
        if (action) {
          moduleGroup.get(action)?.setValue(true);
        }
      });
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.getModules();
  }

  onCheckChange(evt: any, index: number) {
    const val = evt.target.checked;
    const permision = evt.target.value
    console.log('evt', { permision, val });
    this.modules.at(index).controls[permision] = val;
  }

  submit() {
    if (this.form.invalid) return;
    const results: any[] = []
    this.modules.value.forEach(item => {
      const { module, ...rest } = item;
      const values = Object.keys(rest).map(tem => {
        if (item[tem]) return `${module}.${tem}`;
        return
      })
      results.push(...values.filter(Boolean))
    })

    const body: IRole = {
      role_name: this.form.value.role_name as string,
      modules: results,
      active: this.form.value.active
    };
    console.log({ body })
    let serviceArg = this.roleService.createRole(body);
    if (this.id) serviceArg = this.roleService.editRole(this.id, body)
    serviceArg.subscribe({
      next: () => {
        this.router.navigateByUrl(ROLES.url)
      }
    })
  }
}

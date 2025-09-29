import { Component, Input, OnInit } from '@angular/core';
import { RolesService } from '../roles-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-roles-form',
  imports: [ReactiveFormsModule],
  templateUrl: './roles-form.html',
  styleUrl: './roles-form.scss'
})
export class RolesForm implements OnInit {
  isLoading: boolean = false;
  @Input() type: 'new' | 'edit' | 'view' = 'new';
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

  listPermission: any[] = []

  form: FormGroup = new FormGroup({
    role_name: new FormControl(null, [Validators.required]),
    modules: new FormControl(null, [Validators.required]),
  });

  constructor(private roleService: RolesService) { }

  getModules() {
    this.isLoading = true;
    this.roleService.getModules().subscribe((res) => {
      const modules = res
      this.form.controls.modules.patchValue(res);
      const result = Object.values(
        modules.reduce((acc: any, item: string) => {
          const [module, action] = item.split('.');

          if (!acc[module]) {
            acc[module] = { module };
          }

          acc[module][action] = true;
          return acc;
        }, {})
      );
      this.listPermission = result;

      console.log('result', result)
      this.isLoading = false;
    });
  }

  getDetail(id: string) {
    this.isLoading = true;
    this.roleService.getRole(id).subscribe((res) => {
      const modules = res.modules
      this.form.controls.modules.patchValue(modules);
      const result = Object.values(
        modules.reduce((acc: any, item: string) => {
          const [module, action] = item.split('.');

          if (!acc[module]) {
            acc[module] = { module };
          }

          acc[module][action] = true;
          return acc;
        }, {})
      );
      this.listPermission = result;

      console.log('result', result)
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    if (this.type === 'new') {
      this.getModules();
    } else if (this.id) {
      console.log('init id', this.id)
      this.getDetail(this.id)
    }
  }

  onCheckChange(evt: any, index: number) {
    const val = evt.target.checked;
    const permision = evt.target.value
    console.log('evt', { permision, val }, index, this.listPermission[index]);
    this.listPermission[index][permision] = val;
    console.log('this.modules', this.listPermission)

    const results: any[] = []
    this.listPermission.forEach(item => {
      const { module, ...rest } = item;
      const values = Object.keys(rest).map(tem => {
        if (item[tem]) return `${module}.${tem}`;
        return
      })
      results.push(...values.filter(Boolean))
    })

    this.form.controls.modules.patchValue(results)

    console.log({ results })
  }

  submit() {
    const body = this.form.value;
    console.log({ body })
  }
}

import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnInit {
  isLoading: boolean = false;

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

  listPermission: any[] = [{
    module: 'admin'
  }]

  form: FormGroup = new FormGroup({
    first_name: new FormControl(null, [Validators.required]),
    last_name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    role: new FormControl(null, [Validators.required]),
  });

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.getPermissions()
  }

  getPermissions() {
    this.isLoading = true;
    this.userService.getPermissions().subscribe((res) => {
      const { permissions } = res

      const result = Object.values(
        permissions.reduce((acc: any, item: string) => {
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

  onCheckChange(evt: any, index: number) {
    const val = evt.target.checked;
    const permision = evt.target.value
    console.log('evt', { permision, val }, index, this.listPermission[index]);
    this.listPermission[index][permision] = val;
    console.log('this.permissions', this.listPermission)

    const results: any[] = []
    this.listPermission.forEach(item => {
      const { module, ...rest } = item;
      const values = Object.keys(rest).map(tem => {
        if (item[tem]) return `${module}.${tem}`;
        return
      })
      results.push(...values.filter(Boolean))
    })

    console.log({ results })
  }
}

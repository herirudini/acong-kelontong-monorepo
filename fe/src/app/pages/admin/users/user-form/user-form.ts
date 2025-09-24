import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IRole } from '../../../../types/interfaces/user.interface';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnInit {
  isLoading: boolean = false;

  roles: IRole[] = [];

  form: FormGroup = new FormGroup({
    first_name: new FormControl(null, [Validators.required]),
    last_name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    role: new FormControl(null, [Validators.required]),
  });

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.isLoading = true;
    this.userService.getRoles().subscribe((res) => {
      this.roles = res
    })
  }
}

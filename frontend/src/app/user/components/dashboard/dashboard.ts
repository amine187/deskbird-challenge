import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { UserService } from '../../services/user.service';
import { Role, User } from '../../models';
import { AuthService } from '../../../auth/services';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

interface SelectRoleOption {
  label: keyof Pick<typeof Role, 'ADMIN' | 'USER'>;
  value: Role;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.html',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ReactiveFormsModule,
    Dialog,
    SelectModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialog,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    Tag,
    InputTextModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
  ],
  providers: [MessageService, ConfirmationService, UserService],
})
export class Dashboard implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private cd = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  public isLoading = signal(false);
  public user$ = this.authService.user;
  public isEditUserModalVisible: boolean = false;
  public users!: User[];
  public selectedUser!: Partial<User>;
  public selectedUsers!: User[] | null;
  public roles!: SelectRoleOption[];
  public cols!: Column[];
  public exportColumns!: ExportColumn[];
  public userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: [''],
    lastName: [''],
    role: ['', Validators.required],
  });
  public isFormInvalid = computed(() => this.userForm.invalid);

  @ViewChild('dt') dt!: Table;

  public get f() {
    return this.userForm.controls;
  }

  public ngOnInit(): void {
    this.loadUsersData();
  }

  public loadUsersData(): void {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
      this.cd.markForCheck();
    });

    this.roles = [
      { label: 'ADMIN', value: Role.ADMIN },
      { label: 'USER', value: Role.USER },
    ];

    this.cols = [
      { field: 'email', header: 'email' },
      { field: 'firstName', header: 'firstName', customExportHeader: 'Fist Name' },
      { field: 'lastName', header: 'lastName', customExportHeader: 'Last Name' },
      { field: 'role', header: 'Role' },
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  public isInvalidFormControl(controlName: string): boolean | undefined {
    const control = this.userForm.get(controlName);
    return control?.invalid && (control.touched || control.dirty);
  }

  public exportCSV(): void {
    this.dt.exportCSV();
  }

  public editUser(user: User): void {
    this.selectedUser = user;
    this.isEditUserModalVisible = true;

    this.userForm.patchValue({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  }

  public openNew(): void {
    this.selectedUser = {};
    this.isEditUserModalVisible = true;
  }

  public deleteSelectedUsers(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        variant: 'text',
      },
      acceptButtonProps: {
        severity: 'danger',
        label: 'Yes',
      },
      accept: () => {
        this.users = this.users.filter((user) => !this.selectedUsers?.includes(user));
        this.selectedUsers = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Users Deleted',
          life: 3000,
        });
      },
    });
  }

  public hideDialog(): void {
    this.isEditUserModalVisible = false;
  }

  public deleteUser(user: User): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${user.fullName} ?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        variant: 'text',
      },
      acceptButtonProps: {
        severity: 'danger',
        label: 'Yes',
      },
      accept: () => {
        this.users = this.users.filter((user) => user.id !== user.id);
        this.selectedUser = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'User Deleted',
          life: 3000,
        });
      },
    });
  }

  public getSeverity(role: Role): Tag['severity'] {
    switch (role) {
      case Role.ADMIN:
        return 'success';
      case Role.USER:
        return 'warn';
      default:
        return 'success';
    }
  }

  private updateUserInList(updatedUser: Partial<User>): void {
    const index = this.users.findIndex((u) => u.id === updatedUser.id);

    if (index !== -1) {
      const existing = this.users[index];

      this.users[index] = new User({
        ...existing,
        ...updatedUser,
      });

      this.users = [...this.users];
    }
  }

  public saveUser(): void {
    if (this.isFormInvalid()) {
      this.userForm.markAllAsTouched();
      return;
    }

    const updatedUser = {
      ...this.selectedUser,
      ...this.userForm.getRawValue(),
    } as Partial<User>;

    this.isEditUserModalVisible = false;
    this.isLoading.set(true);
    this.userService
      .editUser(this.selectedUser.id!, this.userForm.getRawValue() as Partial<User>)
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.updateUserInList(updatedUser);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Edit User Failed',
            detail: error.error?.message,
          });
        },
      });
  }
}

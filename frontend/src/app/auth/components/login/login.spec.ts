import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';
import { AuthService } from '../../services';
import { MessageService } from 'primeng/api';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        {
          provide: AuthService,
          useClass: null,
        },
        {
          provide: MessageService,
          useClass: null,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

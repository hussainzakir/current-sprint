import { NgModule } from  '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSortModule } from "@angular/material/sort";
import {MatTabsModule} from '@angular/material/tabs';
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
imports: [
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
],
exports: [MatDividerModule,MatSidenavModule,MatSelectModule,MatCardModule,
    MatNativeDateModule,MatDatepickerModule,MatIconModule,MatDialogModule,
    MatProgressSpinnerModule,MatButtonModule,MatSortModule, MatToolbarModule,
     MatCardModule,MatTableModule,MatTabsModule, MatFormFieldModule, MatProgressSpinnerModule,
      MatInputModule, MatPaginatorModule],

})

export  class  AppMaterialModule { }
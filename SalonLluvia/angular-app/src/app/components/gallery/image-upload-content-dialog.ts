import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ReactiveFormsModule, FormControl, FormGroup, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { MatButtonModule, } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import ErrorService from "../../services/error/error-service";
import Hairstyle from "../../dto/gallery/hairstyle";
import NotificationService from "../../services/notification/notification-service";

@Component({
  selector: 'image-upload-content-dialog',
  templateUrl: './image-upload-content-dialog.html',
  imports: [MatCheckboxModule, MatDialogModule, MatButtonModule, MatRadioModule, ɵInternalFormsSharedModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadContentDialog {
  private readonly _http = inject(HttpClient);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _dialogRef = inject(MatDialogRef<ImageUploadContentDialog>);
  private readonly _errorService = inject(ErrorService);
  private readonly _notificationService = inject(NotificationService);

  imageUploadForm = new FormGroup({
    image: new FormControl<File | null>(null, Validators.required),
    gender: new FormControl("f", Validators.required),
    hairstyles: new FormControl<Array<string>>([], Validators.required),
    hairColors: new FormControl<Array<string>>([], Validators.required),
    description: new FormControl("")
  });

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.imageUploadForm.patchValue({
      image: file
    });

    this.imageUploadForm.controls.image?.updateValueAndValidity();
  }

  hasHairstyle(hairstyle: string): boolean {
    return this.imageUploadForm.controls.hairstyles.value?.includes(hairstyle) ?? false;
  }

  hasHairColor(hairColor: string): boolean {
    return this.imageUploadForm.controls.hairColors.value?.includes(hairColor) ?? false;
  }

  toggleHairstyle(hairstyle: string, checked: boolean): void {
    const control = this.imageUploadForm.controls.hairstyles;
    const current = control.value ?? [];

    if (checked) {
      control.setValue([...current, hairstyle]);
    } else {
      control.setValue(current.filter(x => x !== hairstyle));
    }
  }

  toggleHairColor(hairColor: string, checked: boolean): void {
    const control = this.imageUploadForm.controls.hairColors;
    const current = control.value ?? [];

    if (checked) {
      control.setValue([...current, hairColor]);
    } else {
      control.setValue(current.filter(x => x !== hairColor));
    }
  }

  uploadImage(): void {
    const url = "https://api.salonlluvia.com/azureblobstorage/upload"

    console.log("Uploading image...");

    const formData = new FormData();

    formData.append("gender", this.imageUploadForm.controls.gender.value ?? '');
    formData.append("description", this.imageUploadForm.controls.description.value ?? '');

    // asp.net can bind multiple request body keys into a collection
    const hairstyles: string[] = this.imageUploadForm.controls.hairstyles.value ?? [];
    hairstyles.forEach((hairstyle, index) => {
      formData.append(`hairstyles[${index}].style`, hairstyle);
    });

    const hairColors = this.imageUploadForm.controls.hairColors.value ?? [];
    hairColors.forEach((hairColor, index) => {
      formData.append(`hairColors[${index}].color`, hairColor);
    });

    const image = this.imageUploadForm.controls.image.value;

    if (image) {
      formData.append("image", image);
    }

    this._http.post<FormData>(url, formData, {
      credentials: 'include',
      observe: "response"
    })
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log("Successfully uploaded image");

        if (response.body) {
          // backend returns an anonymous object with a detail property
          this._notificationService.alert(response.body.detail, 10_000);
        }

        this._dialogRef.close(true);
      },
      error: (error: HttpErrorResponse) => {
        this._errorService.handleHttpError(error);
      },
      complete: () => {
        
      }
    });
  }
}
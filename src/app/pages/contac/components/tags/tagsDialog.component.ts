import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-tags-dialog',
  templateUrl: './tagsDialog.component.html',
  styleUrls: ['./tagsDialog.component.css']
})
export class TagsDialogComponent {
  newTag: string = '';
  tags: { tagId: number | null, tagValue: string, selected: boolean  }[] = [];

  constructor(
    public dialogRef: MatDialogRef<TagsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private localStorageService: LocalStorageService
  ) {
    this.tags = data.tags.map((tag: any) => ({ ...tag, selected: false }));
  }

    onAddTag() {
      if (this.newTag.trim() !== '') {
        // Verificar si la etiqueta ya existe antes de agregarla
        if (!this.tags.some(tag => tag.tagValue === this.newTag)) {
          this.tags.push({ tagId: null, tagValue: this.newTag, selected: false });
        }
        this.localStorageService.setItem('tags', this.tags);
        this.newTag = '';
      }
    }

    onDeleteTag(tag: { tagId: number | null,  tagValue: string, selected: boolean }) {
      const index = this.tags.indexOf(tag);
      if (index !== -1) {
        this.tags.splice(index, 1);
      }
      this.localStorageService.setItem('tags', this.tags);
    }

  onSave() {
    const selectedTags = this.tags.filter(tag => tag.selected);
    this.dialogRef.close(selectedTags);

  }

  onCancel() {
    this.dialogRef.close(null);
  }
}

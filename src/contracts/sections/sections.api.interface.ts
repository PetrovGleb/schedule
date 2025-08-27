import {
  AddNewSectionDto,
  AddNewSectionResponseDto,
  GetSectionsResponseDto,
} from './sections.dto';

export interface ISectionsController {
  /**
   * Get all sections
   */
  getAllSections: () => Promise<GetSectionsResponseDto>;

  /**
   * Add a new section
   */
  addNewSection: (
    payload: AddNewSectionDto,
  ) => Promise<AddNewSectionResponseDto>;
}

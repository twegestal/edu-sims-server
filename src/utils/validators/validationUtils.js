import { ZodError } from 'zod';

export const Modules = Object.freeze({
  Introduction: 'Introduktion',
  Examination: 'Utredning',
  Diagnosis: 'Diagnos',
  Treatment: 'Behandling',
  Summary: 'Sammanfattning',
});

export const handleZodErrors = (error) => {
  if (error instanceof ZodError) {
    const errors = error.errors.map((e) => ({
      path: e.path[0],
      message: e.message,
    }));
    return {
      success: false,
      errors: errors,
    };
  } else {
    console.error(error);
    throw error;
  }
};

export const handleZodCaseErrors = (error, moduleEnum) => {
  if (error instanceof ZodError) {
    const errors = error.errors.map((e) => ({
      module: moduleEnum,
      path: e.path[0],
      message: e.message,
    }));
    return {
      success: false,
      errors: errors,
    };
  } else {
    console.error(error);
    throw error;
  }
};

export const errorsToString = (errors) => {
  return errors.map((error) => error.message);
};

export const errorWithPathToString = (error) => {
  return `Fält: ${error.path}, Felmeddelande: ${error.message}`;
};

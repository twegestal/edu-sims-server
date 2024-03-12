import { z } from 'zod';
import { handleZodErrors, handleZodCaseErrors } from './validationUtils.js';
import { Modules } from './validationUtils.js';

const caseInProgressSchema = z.object({
  name: z.string().min(1, 'Fallets namn behöver vara minst ett tecken långt'),
  creator_user_id: z.string().uuid(),
  medical_field_id: z.string().uuid(),
});

const caseToPublishSchema = caseInProgressSchema.extend({
  steps: z.array(z.object({})).nonempty({ message: 'Fallet måste innehålla steg' }),
});

const baseModuleSchema = z.object({
  prompt: z
    .string()
    .min(1, 'Uppmaning till användaren får inte vara tom')
    .refine((val) => !val.includes('Fyll i din uppmaning till användaren'), {
      message: 'Uppmaning till användaren är inte ifyllt',
    }),
  feedback_correct: z
    .string()
    .min(1, 'Feedback för korrekt svar får inte vara tom')
    .refine((val) => !val.includes('Fyll i feedback för korrekt svar'), {
      message: 'Feedback för korrekt svar har inte fyllts i',
    }),
  feedback_incorrect: z
    .string()
    .min(1, 'Feedback för inkorrekt svar får inte vara tom')
    .refine((val) => !val.includes('Fyll i feedback för inkorrekt svar'), {
      message: 'Feedback för inkorrekt svar är inte ifyllt',
    }),
});

const introductionSchema = z.object({
  description: z
    .string()
    .min(1, 'Beskrivning av patientmötet får inte vara tom')
    .refine((val) => !val.includes('Fyll i din beskrivning av ett patientmöte'), {
      message: 'Beskrivning av patientmötet är inte ifyllt',
    }),
  prompt: z
    .string()
    .min(1, 'Uppmaning till användaren får inte vara tom')
    .refine((val) => !val.includes('Fyll i din uppmaning till användaren som en Ja/Nej-fråga'), {
      message: 'Uppmaning till användaren är inte ifyllt',
    }),
  feedback_correct: z
    .string()
    .min(1, 'Feedback för korrekt svar får inte vara tom')
    .refine((val) => !val.includes('Fyll i feedback för korrekt svar'), {
      message: 'Feedback för korrekt svar har inte fyllts i',
    }),
  feedback_incorrect: z
    .string()
    .min(1, 'Feedback för inkorrekt svar får inte vara tom')
    .refine((val) => !val.includes('Fyll i feedback för inkorrekt svar'), {
      message: 'Feedback för inkorrekt svar är inte ifyllt',
    }),
});

const examinationSchema = baseModuleSchema.extend({
  examination_to_display: z.record(z.string().uuid(), z.array(z.string().uuid())),
  step_specific_values: z
    .array(
      z.object({
        examination_id: z.string().uuid(),
        is_normal: z.boolean(),
        value: z
          .string()
          .min(1, 'Svarsvärdet på utredningen får inte vara tomt')
          .refine((val) => !val.includes('Fyll i värde här'), {
            message: 'Svarsvärdet för utredning är inte ifyllt',
          }),
      }),
    )
    .nonempty({ message: 'Korrekta utredningar samt svarsvärden är inte ifyllda' }),
  max_nbr_tests: z.number().min(1, 'Max antal test får inte vara lägre än 1'),
});

const diagnosisSchema = baseModuleSchema.extend({
  diagnosis_id: z.string().uuid({ message: 'Rätt diagnos måste vara vald' }),
});

const treatmentSchema = baseModuleSchema.extend({
  step_specific_treatments: z
    .array(
      z.object({
        treatment_id: z.string().uuid(),
        //value: z.string TODO: ska vi inte zod:a value kanske eller kan den sättas till optional?
      }),
    )
    .nonempty({ message: 'Korrekta behandlingar är inte ifyllda' }),
  treatments_to_display: z.record(z.string().uuid(), z.array(z.string().uuid())),
});

const summarySchema = z.object({
  additional_info: z
    .string()
    .refine((val) => !val.includes('Fyll i övrig information om sjukdomen till studenten'), {
      message: 'Övrig information om sjukdomen är inte ifyllt',
    }),
  //TODO: fixa nedanstående så den regex:ar efter en faktisk länk:
  additional_links: z
    .string()
    .refine((val) => !val.includes('Fyll i länkar till övrig information om sjukdomen'), {
      message: 'Övriga länkar om sjukdomen är inte ifyllda',
    }),
  process: z
    .string()
    .min(1, 'Processen får inte vara mindre än ett tecken')
    .refine(
      (val) =>
        !val.includes('Hur hade den korrekta processen sett ut om en läkare tagit sig an fallet?'),
      { message: 'Korrekt procedur är inte ifylld' },
    ),
});

export const validateCaseInProgress = (data) => {
  try {
    caseInProgressSchema.parse(data);
    return {
      success: true,
      errors: null,
    };
  } catch (error) {
    return handleZodErrors(error);
  }
};

export const validateCaseToPublish = (data) => {
  try {
    caseToPublishSchema.parse(data);
    return {
      success: true,
      errors: null,
    };
  } catch (error) {
    return handleZodErrors(error);
  }
};

export const validateIntroductionModule = (data) => {
  try {
    introductionSchema.parse(data);
    return {
      success: true,
      errors: null,
    };
  } catch (error) {
    return handleZodCaseErrors(error, Modules.Introduction);
  }
};

export const validateExaminationModule = (data) => {
  try {
    examinationSchema.parse(data);
    return {
      success: true,
      errors: null,
    };
  } catch (error) {
    return handleZodCaseErrors(error, Modules.Examination);
  }
};

export const validateDiagnosisModule = (data) => {
  try {
    diagnosisSchema.parse(data);
    return {
      success: true,
      errors: null,
    };
  } catch (error) {
    return handleZodCaseErrors(error, Modules.Diagnosis);
  }
};

export const validateTreatmentModule = (data) => {
  try {
    treatmentSchema.parse(data);
    return {
      success: true,
      errors: null,
    };
  } catch (error) {
    return handleZodCaseErrors(error, Modules.Treatment);
  }
};

export const validateSummaryModule = (data) => {
  try {
    summarySchema.parse(data);
    return {
      success: true,
      errors: null,
    };
  } catch (error) {
    return handleZodCaseErrors(error, Modules.Summary);
  }
};

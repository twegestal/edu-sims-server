import * as object from '../models/object_index.js';
import { db } from '../database/databaseConnection.js';

export const insertSteps = async (steps, caseId, transaction) => {
  for (let i = 0; i < steps.length; i++) {
    const stepData = steps[i].stepData;
    const moduleTypeIdentifier = stepData.module_type_identifier;

    switch (moduleTypeIdentifier) {
      case 0: {
        await insertIntroductionStep(stepData, i, caseId, transaction);
        break;
      }
      case 1: {
        await insertExaminationStep(stepData, i, caseId, transaction);
        break;
      }
      case 2: {
        await insertDiagnosisStep(stepData, i, caseId, transaction);
        break;
      }
      case 3: {
        await insertTreatmentStep(stepData, i, caseId, transaction);
        break;
      }
      case 4: {
        await insertSummaryStep(stepData, i, caseId, transaction);
        break;
      }
    }
  }
};

const insertIntroductionStep = async (stepData, index, caseId, transaction) => {
  const introductionStep = await object.introduction.create(
    {
      description: stepData.description,
      prompt: stepData.prompt,
      feedback_correct: stepData.feedback_correct,
      feedback_incorrect: stepData.feedback_incorrect,
    },
    { transaction: transaction },
  );

  await object.step.create(
    {
      case_id: caseId,
      index: index,
      module_type_identifier: stepData.module_type_identifier,
      step_id: introductionStep.id,
    },
    { transaction: transaction },
  );
};

const insertExaminationStep = async (stepData, index, caseId, transaction) => {
  const examinationStep = await object.examination.create(
    {
      prompt: stepData.prompt,
      examination_to_display: stepData.examination_to_display,
      feedback_correct: stepData.feedback_correct,
      feedback_incorrect: stepData.feedback_incorrect,
      max_nbr_tests: stepData.max_nbr_tests,
    },
    { transaction: transaction },
  );

  for (let i = 0; i < stepData.step_specific_values.length; i++) {
    await object.step_specific_values.create(
      {
        examination_step_id: examinationStep.id,
        examination_id: stepData.step_specific_values[i].examination_id,
        value: stepData.step_specific_values[i].value,
        is_normal: stepData.step_specific_values[i].is_normal,
      },
      { transaction: transaction },
    );
  }

  await object.step.create(
    {
      case_id: caseId,
      index: index,
      module_type_identifier: stepData.module_type_identifier,
      step_id: examinationStep.id,
    },
    { transaction: transaction },
  );
};

const insertDiagnosisStep = async (stepData, index, caseId, transaction) => {
  const diagnosisStep = await object.diagnosis.create(
    {
      prompt: stepData.prompt,
      diagnosis_id: stepData.diagnosis_id,
      feedback_correct: stepData.feedback_correct,
      feedback_incorrect: stepData.feedback_incorrect,
    },
    { transaction: transaction },
  );

  await object.step.create(
    {
      case_id: caseId,
      index: index,
      module_type_identifier: stepData.module_type_identifier,
      step_id: diagnosisStep.id,
    },
    { transaction: transaction },
  );
};

const insertTreatmentStep = async (stepData, index, caseId, transaction) => {
  const treatmentStep = await object.treatment.create(
    {
      prompt: stepData.prompt,
      treatments_to_display: stepData.treatments_to_display,
      feedback_correct: stepData.feedback_correct,
      feedback_incorrect: stepData.feedback_incorrect,
    },
    { transaction: transaction },
  );

  for (let i = 0; i < stepData.step_specific_treatments.length; i++) {
    await object.step_specific_treatment.create(
      {
        treatment_step_id: treatmentStep.id,
        treatment_id: stepData.step_specific_treatments[i].treatment_id,
        value: stepData.step_specific_treatments[i].value,
      },
      { transaction: transaction },
    );
  }

  await object.step.create(
    {
      case_id: caseId,
      index: index,
      module_type_identifier: stepData.module_type_identifier,
      step_id: treatmentStep.id,
    },
    { transaction: transaction },
  );
};

const insertSummaryStep = async (stepData, index, caseId, transaction) => {
  const summaryStep = await object.summary.create(
    {
      process: stepData.process,
      additional_info: stepData.additional_info,
      additional_links: stepData.additional_links,
    },
    { transaction: transaction },
  );

  await object.step.create(
    {
      case_id: caseId,
      index: index,
      module_type_identifier: stepData.module_type_identifier,
      step_id: summaryStep.id,
    },
    { transaction: transaction },
  );
};

export const updateSteps = async (steps, medicalCaseId, transaction) => {
  for (let i = 0; i < steps.length; i++) {
    const stepData = steps[i].stepData;
    const moduleTypeIdentifier = steps[i].module_type_identifier;
    const stepTableId = steps[i].stepTableId;
    const moduleTableId = steps[i].moduleTableId;
    switch (moduleTypeIdentifier) {
      case 0: {
        await updateIntroductionStep(
          stepData,
          i,
          transaction,
          stepTableId,
          moduleTableId,
          medicalCaseId,
        );
        break;
      }
      case 1: {
        await updateExaminationStep(
          stepData,
          i,
          transaction,
          stepTableId,
          moduleTableId,
          medicalCaseId,
        );
        break;
      }
      case 2: {
        await updateDiagnosisStep(
          stepData,
          i,
          transaction,
          stepTableId,
          moduleTableId,
          medicalCaseId,
        );
        break;
      }
      case 3: {
        await updateTreatmentStep(
          stepData,
          i,
          transaction,
          stepTableId,
          moduleTableId,
          medicalCaseId,
        );
        break;
      }
      case 4: {
        await updateSummaryStep(
          stepData,
          i,
          transaction,
          stepTableId,
          moduleTableId,
          medicalCaseId,
        );
        break;
      }
    }
  }
};

const updateIntroductionStep = async (
  stepData,
  index,
  transaction,
  stepTableId,
  moduleTableId,
  medicalCaseId,
) => {
  if (moduleTableId) {
    const introductionStep = await object.introduction.findOne({
      where: {
        id: moduleTableId,
      },
    });

    const step = await object.step.findOne({
      where: {
        id: stepTableId,
      },
    });

    if (!introductionStep || !step) {
      throw new Error('Resource not found');
    }

    await introductionStep.update(
      {
        description: stepData.description,
        prompt: stepData.prompt,
        feedback_correct: stepData.feedback_correct,
        feedback_incorrect: stepData.feedback_incorrect,
      },
      { transaction: transaction },
    );

    await step.update(
      {
        index: index,
      },
      { transaction: transaction },
    );
  } else {
    await insertIntroductionStep(stepData, index, medicalCaseId, transaction);
  }
};

const updateExaminationStep = async (
  stepData,
  index,
  transaction,
  stepTableId,
  moduleTableId,
  medicalCaseId,
) => {
  if (moduleTableId) {
    const examinationStep = await object.examination.findOne({
      where: {
        id: moduleTableId,
      },
    });

    const step = await object.step.findOne({
      where: {
        id: stepTableId,
      },
    });

    if (!examinationStep || !step) {
      throw new Error('Resource not found');
    }

    await examinationStep.update(
      {
        prompt: stepData.prompt,
        examination_to_display: stepData.examination_to_display,
        feedback_correct: stepData.feedback_correct,
        feedback_incorrect: stepData.feedback_incorrect,
        max_nbr_tests: stepData.max_nbr_tests,
      },
      { transaction: transaction },
    );

    for (let i = 0; i < stepData.step_specific_values.length; i++) {
      const valueId = stepData.step_specific_values[i].id;
      if (valueId) {
        const stepSpecificValue = await object.step_specific_values.findOne({
          where: {
            id: valueId,
          },
        });

        if (!stepSpecificValue) {
          throw new Error('Resource not found');
        }

        await stepSpecificValue.update(
          {
            value: stepData.step_specific_values[i].value,
            is_normal: stepData.step_specific_values[i].is_normal,
          },
          { transaction: transaction },
        );
      } else {
        await object.step_specific_values.create(
          {
            examination_step_id: examinationStep.id,
            examination_id: stepData.step_specific_values[i].examination_id,
            value: stepData.step_specific_values[i].value,
            is_normal: stepData.step_specific_values[i].is_normal,
          },
          { transaction: transaction },
        );
      }
    }

    await step.update(
      {
        index: index,
      },
      { transaction: transaction },
    );
  } else {
    await insertExaminationStep(stepData, index, medicalCaseId, transaction);
  }
};

const updateDiagnosisStep = async (
  stepData,
  index,
  transaction,
  stepTableId,
  moduleTableId,
  medicalCaseId,
) => {
  if (moduleTableId) {
    const diagnosisStep = await object.diagnosis.findOne({
      where: {
        id: moduleTableId,
      },
    });

    const step = await object.step.findOne({
      where: {
        id: stepTableId,
      },
    });

    if (!diagnosisStep || !step) {
      throw new Error('Resource not found');
    }

    await diagnosisStep.update(
      {
        prompt: stepData.prompt,
        diagnosis_id: stepData.diagnosis_id,
        feedback_correct: stepData.feedback_correct,
        feedback_incorrect: stepData.feedback_incorrect,
      },
      { transaction: transaction },
    );

    await step.update(
      {
        index: index,
      },
      { transaction: transaction },
    );
  } else {
    await insertDiagnosisStep(stepData, index, medicalCaseId, transaction);
  }
};

const updateTreatmentStep = async (
  stepData,
  index,
  transaction,
  stepTableId,
  moduleTableId,
  medicalCaseId,
) => {
  if (moduleTableId) {
    const treatmentStep = await object.treatment.findOne({
      where: {
        id: moduleTableId,
      },
    });

    const step = await object.step.findOne({
      where: {
        id: stepTableId,
      },
    });

    if (!treatmentStep || !step) {
      throw new Error('Resource not found');
    }

    await treatmentStep.update(
      {
        prompt: stepData.prompt,
        treatments_to_display: stepData.treatments_to_display,
        feedback_correct: stepData.feedback_correct,
        feedback_incorrect: stepData.feedback_incorrect,
      },
      { transaction: transaction },
    );

    for (let i = 0; i < stepData.step_specific_treatments.length; i++) {
      const valueId = stepData.step_specific_treatments[i].id;
      if (valueId) {
        const stepSpecificTreatment = await object.step_specific_treatment.findOne({
          where: {
            id: valueId,
          },
        });

        if (!stepSpecificTreatment) {
          throw new Error('Resource not found');
        }

        await stepSpecificTreatment.update(
          {
            value: stepData.step_specific_treatments[i].value,
          },
          { transaction: transaction },
        );
      } else {
        await object.step_specific_treatment.create(
          {
            treatment_step_id: treatmentStep.id,
            treatment_id: stepData.step_specific_treatments[i].treatment_id,
            value: stepData.step_specific_treatments[i].value,
          },
          { transaction: transaction },
        );
      }
    }

    await step.update(
      {
        index: index,
      },
      { transaction: transaction },
    );
  } else {
    await insertTreatmentStep(stepData, index, medicalCaseId, transaction);
  }
};

const updateSummaryStep = async (
  stepData,
  index,
  transaction,
  stepTableId,
  moduleTableId,
  medicalCaseId,
) => {
  if (moduleTableId) {
    const summaryStep = await object.summary.findOne({
      where: {
        id: moduleTableId,
      },
    });

    const step = await object.step.findOne({
      where: {
        id: stepTableId,
      },
    });

    if (!summaryStep || !step) {
      throw new Error('Resource not found');
    }

    await summaryStep.update(
      {
        process: stepData.process,
        additional_info: stepData.additional_info,
        additional_links: stepData.additional_links,
      },
      { transaction: transaction },
    );

    await step.update(
      {
        index: index,
      },
      { transaction: transaction },
    );
  } else {
    await insertSummaryStep(stepData, index, medicalCaseId, transaction);
  }
};

export const deleteModules = async (removedModules) => {
  removedModules.forEach(async (module) => {
    const moduleTypeIdentifier = module.module_type_identifier;
    switch (moduleTypeIdentifier) {
      case 0: {
        await db.query(`CALL remove_introduction_step('${module.moduleTableId}')`);

        break;
      }
      case 1: {
        await db.query(`CALL remove_examination_step('${module.moduleTableId}')`);

        break;
      }
      case 2: {
        await db.query(`CALL remove_diagnosis_step('${module.moduleTableId}')`);

        break;
      }
      case 3: {
        await db.query(`CALL remove_treatment_step('${module.moduleTableId}')`);

        break;
      }
      case 4: {
        await db.query(`CALL remove_summary_step('${module.moduleTableId}')`);

        break;
      }
    }
  });
};

import * as object from '../models/object_index.js';

/**
 * This file contains helper methods used by caseRoutes.js. All the database queries in this file are wrapped in a try-catch block
 * in the calling method in caseRoutes.js.
 */

export const sortAttempts = (attempts) => {
  const map = new Map();

  attempts.map((element) => {
    if (map.has(element.dataValues.case_id)) {
      const currentTimestamp = element.dataValues.timestamp_started;
      const timestampToCompare = map.get(element.dataValues.case_id).timestamp_started;
      if (currentTimestamp > timestampToCompare) {
        map.set(element.dataValues.case_id, element.dataValues);
      }
    } else {
      map.set(element.dataValues.case_id, element.dataValues);
    }
  });

  for (let [caseId, attemptData] of map) {
    if (attemptData.is_finished) {
      map.delete(caseId);
    }
  }

  const resultArray = Array.from(map, ([key, value]) => ({ case_id: key, ...value }));
  return resultArray;
};

export const fetchStepData = async (steps, medicalFieldId) => {
  for (let i = 0; i < steps.length; i++) {
    let step = steps[i];
    switch (step.module_type_identifier) {
      case 0: {
        const stepData = await fetchIntroductionStep(step.step_id);
        step.dataValues = { ...step.dataValues, stepData: stepData };
        break;
      }
      case 1: {
        const stepData = await fetchExaminationStep(step.step_id);
        step.dataValues = { ...step.dataValues, stepData: stepData };
        break;
      }
      case 2: {
        const stepData = await fetchDiagnosisStep(step.step_id, medicalFieldId);
        step.dataValues = { ...step.dataValues, stepData: stepData };
        break;
      }
      case 3: {
        const stepData = await fetchTreatmentStep(step.step_id);
        step.dataValues = { ...step.dataValues, stepData: stepData };
        break;
      }
      case 4: {
        const stepData = await fetchSummaryStep(step.step_id);
        step.dataValues = { ...step.dataValues, stepData: stepData };
        break;
      }
    }
  }

  return steps;
};

const fetchIntroductionStep = async (stepId) => {
  const stepData = await object.introduction.findOne({
    where: {
      id: stepId,
    },
  });
  return stepData;
};

const fetchExaminationStep = async (stepId) => {
  const stepData = await object.examination.findOne({
    where: {
      id: stepId,
    },
  });

  stepData.examination_to_display = await fetchExaminationsToDisplay(
    stepData.examination_to_display,
  );

  return stepData;
};

const fetchExaminationsToDisplay = async (examinationsToDisplay) => {
  let examinationToDisplay = {};
  const examinationList = await object.examination_list.findAll({ order: [['name', 'ASC']] });
  const examinationTypes = await object.examination_type.findAll();
  const examinationSubTypes = await object.examination_subtype.findAll();

  for (const [examinationType, examinationSubTypeArray] of Object.entries(examinationsToDisplay)) {
    const filteredType = examinationTypes.find((examination) => examination.id === examinationType);

    if (filteredType) {
      const examinationTypeName = filteredType.name;

      let subTypes = {};
      for (const element of examinationSubTypeArray) {
        const filteredSubType = examinationSubTypes.find((subType) => subType.id === element);

        if (filteredSubType) {
          const subTypeName = filteredSubType.name;

          subTypes[subTypeName] = examinationList.filter(
            (examination) => examination.examination_subtype_id === filteredSubType.id,
          );
        }
      }

      examinationToDisplay[examinationTypeName] = subTypes;
    }
  }

  return examinationToDisplay;
};

const fetchDiagnosisStep = async (stepId, medicalFieldId) => {
  const stepData = await object.diagnosis.findOne({
    where: {
      id: stepId,
    },
  });

  stepData.dataValues.diagnosis_list = await object.diagnosis_list.findAll({
    where: { medical_field_id: medicalFieldId },
  });

  return stepData;
};

const fetchTreatmentStep = async (stepId) => {
  const stepData = await object.treatment.findOne({
    where: {
      id: stepId,
    },
  });

  stepData.treatments_to_display = await fetchTreatmentsToDisplay(stepData.treatments_to_display);

  return stepData;
};

const fetchTreatmentsToDisplay = async (treatmentsToDisplay) => {
  let treatmentToDisplay = {};
  const treatmentList = await object.treatment_list.findAll({ order: [['name', 'ASC']] });
  const treatmentTypes = await object.treatment_type.findAll();
  const treatmentSubtypes = await object.treatment_subtype.findAll();

  for (const [treatmentType, treatmentSubtypeArray] of Object.entries(treatmentsToDisplay)) {
    const filteredType = treatmentTypes.find((treatment) => treatment.id === treatmentType);

    if (filteredType) {
      const treatmentTypeName = filteredType.name;

      let subTypes = {};
      for (const element of treatmentSubtypeArray) {
        const filteredSubtype = treatmentSubtypes.find((subType) => subType.id === element);

        if (filteredSubtype) {
          const subTypeName = filteredSubtype.name;

          subTypes[subTypeName] = treatmentList.filter(
            (treatment) => treatment.treatment_subtype_id === filteredSubtype.id,
          );
        }
      }

      treatmentToDisplay[treatmentTypeName] = subTypes;
    }
  }

  return treatmentToDisplay;
};

const fetchSummaryStep = async (stepId) => {
  const stepData = await object.summary.findOne({
    where: {
      id: stepId,
    },
  });

  return stepData;
};

import { end_user } from './end_user.js';
import { medical_case } from './medical_case.js';
import { medical_field } from './medical_field.js';
import { examination_type } from './examination_type.js';
import { examination_subtype } from './examination_subtype.js';
import { step } from './step.js';
import { treatment } from './treatment.js';
import { attempt } from './attempt.js';
import { diagnosis_list } from './diagnosis_list.js';
import { diagnosis } from './diagnosis.js';
import { examination_list } from './examination_list.js';
import { module_type } from './module_type.js';
import { examination } from './examination.js';
import { introduction } from './introduction.js';
import { step_specific_treatment } from './step_specific_treatment.js';
import { step_specific_values } from './step_specific_values.js';
import { summary } from './summary.js';
import { treatment_list } from './treatment_list.js';
import { treatment_subtype } from './treatment_subtype.js';
import { treatment_type } from './treatment_type.js';
import { user_group } from './user_group.js';
import { db } from '../database/databaseConnection.js';

const environment = process.env.DEV_ENVIRONMENT;

/*
Defines the relations between all objects and initializes them
*/

end_user.belongsTo(user_group, {
  foreignKey: 'group_id',
});

attempt.belongsTo(end_user, {
  foreignKey: 'user_id',
});

medical_case.belongsTo(end_user, {
  foreignKey: 'creator_user_id',
});

attempt.belongsTo(medical_case, {
  foreignKey: 'case_id',
});

diagnosis_list.belongsTo(medical_field, {
  foreignKey: 'medical_field_id',
});

diagnosis.belongsTo(diagnosis_list, {
  foreignKey: {
    name: 'diagnosis_id',
  },
});

examination_subtype.belongsTo(examination_type, {
  foreignKey: 'examination_type_id',
});

examination_list.belongsTo(examination_type, {
  foreignKey: 'examination_type_id',
});

examination_list.belongsTo(examination_subtype, {
  foreignKey: 'examination_subtype_id',
});

medical_case.belongsTo(medical_field, {
  foreignKey: 'medical_field_id',
});

step_specific_treatment.belongsTo(treatment, {
  foreignKey: 'treatment_step_id',
});

step_specific_treatment.belongsTo(treatment_list, {
  foreignKey: 'treatment_id',
});

step_specific_values.belongsTo(examination, {
  foreignKey: 'examination_step_id',
});

//step_specific_values.hasOne(examination_list)

step.belongsTo(medical_case, {
  foreignKey: 'case_id',
});

step.belongsTo(module_type, {
  foreignKey: 'module_type_identifier',
  targetKey: 'module_type_identifier',
});

treatment_list.belongsTo(treatment_type, {
  foreignKey: 'treatment_type_id',
});

treatment_list.belongsTo(treatment_subtype, {
  foreignKey: 'treatment_subtype_id',
});

treatment_subtype.belongsTo(treatment_type, {
  foreignKey: 'treatment_type_id',
});

if (process.env.DEV_ENVIRONMENT === 'local') {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');

    /*dom utkommenterade metoderna nedanför är utkommenterade för försäkra att live-databasen inte skrivs över av misstag
        om du vill sätta upp och populera en lokal databas måste dessa kommenteras in igen
      */

    //await db.sync({ force: true });
    console.log('Tables synchronized successfully.');
    //await populateDB()
    console.log('Inserted succesfully.');
  } catch (error) {
    console.error('Sync error: ', error);
  }
}

export {
  attempt,
  diagnosis_list,
  diagnosis,
  end_user,
  examination_list,
  examination_subtype,
  examination_type,
  examination,
  introduction,
  medical_case,
  medical_field,
  module_type,
  step_specific_treatment,
  step_specific_values,
  step,
  summary,
  treatment_list,
  treatment_subtype,
  treatment_type,
  treatment,
  user_group,
};

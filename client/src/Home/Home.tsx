import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'urql';
import * as yup from 'yup';

const Prediction = `
  mutation(
      $age: Int!
      $restingBloodPressure: Int!
      $cholesterol: Int!
      $fastingBloodSugar: Int!
      $maxHeartRate: Int!
      $oldpeak: Float!
      $sex: Sex!
      $chestPainType: ChestPainType!
      $restingECG: RestingECG!
      $exerciseAngina: YESNO!
      $stSlope: ST_Slope!)  {
    prediction(
      age: $age
      restingBloodPressure: $restingBloodPressure
      cholesterol: $cholesterol
      fastingBloodSugar: $fastingBloodSugar
      maxHeartRate: $maxHeartRate
      oldpeak: $oldpeak
      sex: $sex
      chestPainType: $chestPainType
      restingECG: $restingECG
      exerciseAngina: $exerciseAngina
      stSlope: $stSlope)
  }
`;

const schema = yup
  .object({
    age: yup.number().required('Age is required').positive().integer(),
    restingBloodPressure: yup.number().required().positive().integer(),
    cholesterol: yup.number().required().positive().integer(),
    fastingBloodSugar: yup.number().required().integer(),
    maxHeartRate: yup.number().required().positive().integer(),
    oldpeak: yup.number().required(),
    sex: yup.string().oneOf(['MALE', 'FEMALE']).required(),
    chestPainType: yup.string().oneOf(['NONE', 'ASY', 'ATA', 'NAP', 'TA']).required(),
    restingECG: yup.string().oneOf(['LVH', 'NORMAL', 'ST']).required(),
    exerciseAngina: yup.string().oneOf(['YES', 'NO']).required(),
    stSlope: yup.string().oneOf(['DOWN', 'FLAT', 'UP']).required(),
  })
  .required();

const DEFAULT_VALUES = {
  age: null as number | null,
  restingBloodPressure: null as number | null,
  cholesterol: null as number | null,
  fastingBloodSugar: null as number | null,
  maxHeartRate: null as number | null,
  oldpeak: null as number | null,
  sex: 'FEMALE',
  chestPainType: 'NONE',
  restingECG: 'NORMAL',
  exerciseAngina: null as string | null,
  stSlope: 'FLAT',
};

export default function Home() {
  const [showResult, setShowResult] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(schema),
  });

  const [predictionResult, predict] = useMutation(Prediction);

  const formContent = 'sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5';
  const formLabel = 'block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2';
  const formInputSection = 'mt-1 sm:mt-0 sm:col-span-2';
  const formInput =
    'block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md';
  const formSelect =
    'mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md';
  const formError = 'mt-2 text-sm text-red-600';

  return (
    <div className="relative bg-white">
      <div className="lg:absolute lg:inset-0">
        <div className="lg:absolute lg:inset-y-0 lg:left-0 lg:w-1/2">
          <img className="h-56 w-full object-cover lg:absolute lg:h-full" src="/images/heart2.jpeg" alt="" />
        </div>
      </div>
      <div className="relative pt-12 pb-16 px-4 sm:pt-16 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-2">
        <div className="lg:col-start-2 lg:pl-8">
          <div className="text-base max-w-prose mx-auto lg:max-w-lg lg:ml-auto lg:mr-0">
            <h2 className="leading-6 text-indigo-600 font-semibold tracking-wide uppercase">Prediction</h2>

            {showResult && (
              <>
                <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  Results
                </h3>

                {predictionResult.data?.prediction === 0 && (
                  <div className="flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-32 w-32 text-green-600 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="my-3 ml-6 text-lg text-gray-500">
                      Congratulation, Based on the entered data point, our algorithm does not detect any heart failure.
                    </p>
                  </div>
                )}

                {predictionResult.data?.prediction === 1 && (
                  <div className="flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-32 w-32 text-red-600 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="my-3 ml-6 text-lg text-gray-500">
                      Uh Oh, Based on the entered data point, our algorithm does detect a possible heart failure.
                    </p>
                  </div>
                )}

                <div className="pt-96">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        reset(DEFAULT_VALUES);
                        setShowResult(false);
                      }}
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Start Over
                    </button>
                  </div>
                </div>
              </>
            )}

            {!showResult && (
              <>
                <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  Enter Your Data
                </h3>
                <p className="my-3 text-lg text-gray-500">
                  Enter the information below to see whether our algorithm predicts the possibility of heart failure.
                  You can also choose one of the sample data below.
                </p>

                <div className="mb-6 flex space-x-10">
                  <button
                    onClick={() => {
                      reset({
                        age: 63,
                        restingBloodPressure: 140,
                        cholesterol: 195,
                        fastingBloodSugar: 0,
                        maxHeartRate: 179,
                        oldpeak: 0.0,
                        sex: 'FEMALE',
                        chestPainType: 'ATA',
                        restingECG: 'NORMAL',
                        exerciseAngina: 'NO',
                        stSlope: 'UP',
                      });
                    }}
                  >
                    User 1
                  </button>

                  <button
                    onClick={() => {
                      reset({
                        age: 53,
                        restingBloodPressure: 145,
                        cholesterol: 518,
                        fastingBloodSugar: 0,
                        maxHeartRate: 130,
                        oldpeak: 0.0,
                        sex: 'MALE',
                        chestPainType: 'NAP',
                        restingECG: 'NORMAL',
                        exerciseAngina: 'NO',
                        stSlope: 'FLAT',
                      });
                    }}
                  >
                    User 2
                  </button>

                  <button
                    onClick={() => {
                      reset({
                        age: 65,
                        restingBloodPressure: 160,
                        cholesterol: 223,
                        fastingBloodSugar: 1,
                        maxHeartRate: 122,
                        oldpeak: 1.2,
                        sex: 'MALE',
                        chestPainType: 'ASY',
                        restingECG: 'ST',
                        exerciseAngina: 'NO',
                        stSlope: 'FLAT',
                      });
                    }}
                  >
                    User 3
                  </button>

                  <button
                    onClick={() => {
                      reset({
                        age: 54,
                        restingBloodPressure: 108,
                        cholesterol: 309,
                        fastingBloodSugar: 0,
                        maxHeartRate: 156,
                        oldpeak: 0.0,
                        sex: 'MALE',
                        chestPainType: 'ATA',
                        restingECG: 'NORMAL',
                        exerciseAngina: 'NO',
                        stSlope: 'UP',
                      });
                    }}
                  >
                    User 4
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit(async (value) => {
                    console.log(value);
                    await predict(value);
                    setShowResult(true);
                  })}
                  className="space-y-8 divide-y divide-gray-200"
                >
                  <div className="space-y-3">
                    <div className={formContent}>
                      <label htmlFor="age" className={formLabel}>
                        Age
                      </label>
                      <div className={formInputSection}>
                        <input type="text" {...register('age')} className={formInput} />
                        {errors.age && <p className={formError}>{errors.age?.message}</p>}
                      </div>
                    </div>

                    <div className={formContent}>
                      <label htmlFor="sex" className={formLabel}>
                        Sex
                      </label>
                      <div className={formInputSection}>
                        <select {...register('sex')} className={formSelect}>
                          <option value="FEMALE">Female</option>
                          <option value="MALE">Male</option>
                        </select>
                      </div>
                    </div>

                    <div className={formContent}>
                      <label htmlFor="chestPainType" className={formLabel}>
                        Chest Pain Type
                      </label>
                      <div className={formInputSection}>
                        <select {...register('chestPainType')} className={formSelect}>
                          <option value="NONE">None</option>
                          <option value="TA">Typical Angina</option>
                          <option value="ATA">Atypical Angina</option>
                          <option value="NAP">Non-Anginal Pain</option>
                          <option value="ASY">Asymptomatic</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className={formContent}>
                    <label htmlFor="restingBloodPressure" className={formLabel}>
                      Resting Blood Pressure
                    </label>
                    <div className={formInputSection}>
                      <input type="text" {...register('restingBloodPressure')} className={formInput} />
                      {errors.restingBloodPressure && (
                        <p className={formError}>{errors.restingBloodPressure?.message}</p>
                      )}
                    </div>
                  </div>

                  <div className={formContent}>
                    <label htmlFor="cholesterol" className={formLabel}>
                      Cholesterol
                    </label>
                    <div className={formInputSection}>
                      <input type="text" {...register('cholesterol')} className={formInput} />
                      {errors.cholesterol && <p className={formError}>{errors.cholesterol?.message}</p>}
                    </div>
                  </div>

                  <div className={formContent}>
                    <label htmlFor="fastingBloodSugar" className={formLabel}>
                      Fasting Blood Sugar
                    </label>
                    <div className={formInputSection}>
                      <input type="text" {...register('fastingBloodSugar')} className={formInput} />
                      {errors.fastingBloodSugar && <p className={formError}>{errors.fastingBloodSugar?.message}</p>}
                    </div>
                  </div>

                  <div className={formContent}>
                    <label htmlFor="restingECG" className={formLabel}>
                      Resting ECG
                    </label>
                    <div className={formInputSection}>
                      <select {...register('restingECG')} className={formSelect}>
                        <option value="NORMAL">Normal</option>
                        <option value="ST">ST-T Wave Abnormality</option>
                        <option value="LVH">Left Ventricular Hypertrophy</option>
                      </select>
                    </div>
                  </div>

                  <div className={formContent}>
                    <label htmlFor="maxHeartRate" className={formLabel}>
                      Max Heart Rate
                    </label>
                    <div className={formInputSection}>
                      <input type="text" {...register('maxHeartRate')} className={formInput} />
                      {errors.maxHeartRate && <p className={formError}>{errors.maxHeartRate?.message}</p>}
                    </div>
                  </div>

                  <div className={formContent}>
                    <label htmlFor="exerciseAngina" className={formLabel}>
                      Exercise Angina
                    </label>
                    <div className={formInputSection}>
                      <select {...register('exerciseAngina')} className={formSelect}>
                        <option value="NO">No</option>
                        <option value="YES">Yes</option>
                      </select>

                      {errors.exerciseAngina && <p className={formError}>{errors.exerciseAngina?.message}</p>}
                    </div>
                  </div>

                  <div className={formContent}>
                    <label htmlFor="oldpeak" className={formLabel}>
                      Old Peak
                    </label>
                    <div className={formInputSection}>
                      <input type="text" {...register('oldpeak')} className={formInput} />
                      {errors.oldpeak && <p className={formError}>{errors.oldpeak?.message}</p>}
                    </div>
                  </div>

                  <div className={formContent}>
                    <label htmlFor="stSlope" className={formLabel}>
                      ST Slope
                    </label>
                    <div className={formInputSection}>
                      <select {...register('stSlope')} className={formSelect}>
                        <option value="UP">Up</option>
                        <option value="FLAT">Flat</option>
                        <option value="DOWN">Down</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Predict
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

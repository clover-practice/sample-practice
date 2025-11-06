import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number; // 1-based index (e.g., 1, 2, 3)
}

const StepIndicator: React.FC<StepIndicatorProps> = ({steps, currentStep}) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        const isLast = stepNumber === steps.length;

        return (
          <View key={index} style={styles.stepContainer}>
            {/* Line before (except first step) */}
            {index > 0 && (
              <View
                style={[
                  styles.line,
                  isCompleted || isActive
                    ? styles.lineActive
                    : styles.lineInactive,
                ]}
              />
            )}

            {/* Circle */}
            <View
              style={[
                styles.circle,
                isCompleted
                  ? styles.circleCompleted
                  : isActive
                  ? styles.circleActive
                  : styles.circleInactive,
              ]}>
              {isCompleted ? (
                <Icon name="check" size={16} color="#fff" />
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    isActive && {color: '#fff'},
                    !isActive && {color: '#6B7280'},
                  ]}>
                  {stepNumber}
                </Text>
              )}
            </View>

            {/* Line after (except last step) */}
            {!isLast && (
              <View
                style={[
                  styles.line,
                  isCompleted ? styles.lineActive : styles.lineInactive,
                ]}
              />
            )}

            {/* Label */}
            <Text style={styles.label}>{step.label}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default StepIndicator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 20,
    width: '100%',
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  line: {
    position: 'absolute',
    top: 20,
    left: '50%',
    right: '-50%',
    height: 2,
    zIndex: -1,
  },
  lineActive: {
    backgroundColor: '#22C55E', // green line
  },
  lineInactive: {
    backgroundColor: '#E5E7EB', // gray line
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  circleCompleted: {
    backgroundColor: '#22C55E', // green circle
  },
  circleActive: {
    backgroundColor: '#2563EB', // blue circle
  },
  circleInactive: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  stepNumber: {
    fontWeight: '600',
    fontSize: 14,
  },
  label: {
    fontSize: 13,
    color: '#111827',
    marginTop: 8,
    textAlign: 'center',
  },
});



// const steps = [
//   {label: 'Add Content'},
//   {label: 'Add Settings'},
//   {label: 'Preview & Publish'},
// ];
//   const [currentStep, setCurrentStep] = useState(2);
// <StepIndicator steps={steps} currentStep={currentStep} />
//       <Button
//         title="Next Step"
//         onPress={() =>
//           setCurrentStep(prev => (prev < 3 ? prev + 1 : 1))
//         }
//       />
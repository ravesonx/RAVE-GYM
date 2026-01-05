export interface Exercise {
    name: string;
    sets: string;
    reps: string;
    note?: string;
}

export interface WorkoutPlan {
    id: number;
    exercises: Exercise[];
}

export const WORKOUT_DATA: { [key: string]: { [key: number]: WorkoutPlan } } = {
    chest: {
        0: { // Beginner Chest (Başlangıç Göğüs)
            id: 1,
            exercises: [
                { name: "Barbell Bench Press", sets: "3", reps: "10-12", note: "Flat bench, medium grip" },
                { name: "Incline Dumbbell Press", sets: "3", reps: "10-12", note: "30-45 degree incline" },
                { name: "Machine Chest Fly", sets: "3", reps: "12-15", note: "Focus on squeeze" },
                { name: "Push Ups", sets: "3", reps: "Failure", note: "Finisher" }
            ]
        },
        1: { // Upper Chest Focus (Üst Göğüs Odaklı)
            id: 2,
            exercises: [
                { name: "Incline Barbell Bench Press", sets: "4", reps: "8-10" },
                { name: "Incline Dumbbell Fly", sets: "3", reps: "12" },
                { name: "Low-to-High Cable Crossover", sets: "4", reps: "15", note: "Pull upwards" },
                { name: "Reverse Grip Bench Press", sets: "3", reps: "10-12" }
            ]
        },
        2: { // Advanced Volume (İleri Seviye Hacim)
            id: 3,
            exercises: [
                { name: "Barbell Bench Press", sets: "5", reps: "5-8", note: "Heavy compound" },
                { name: "Weighted Dips", sets: "4", reps: "8-10" },
                { name: "Incline Dumbbell Press", sets: "4", reps: "10-12" },
                { name: "Cable Crossover", sets: "4", reps: "15-20", note: "Drop set on last set" },
                { name: "Dumbbell Pullover", sets: "3", reps: "12-15" }
            ]
        }
    },
    back: {
        0: { // Overall Back (Genel Sırt)
            id: 1,
            exercises: [
                { name: "Lat Pulldown", sets: "3", reps: "10-12" },
                { name: "Seated Cable Row", sets: "3", reps: "10-12" },
                { name: "Face Pulls", sets: "3", reps: "15" },
                { name: "Hyperextensions", sets: "3", reps: "15" }
            ]
        },
        1: { // Lats & Width (Kanat & Genişlik)
            id: 2,
            exercises: [
                { name: "Wide Grip Pull Ups", sets: "4", reps: "Failure" },
                { name: "Wide Grip Lat Pulldown", sets: "4", reps: "10-12" },
                { name: "Straight Arm Pulldown", sets: "3", reps: "15" },
                { name: "Single Arm Dumbbell Row", sets: "3", reps: "10-12" }
            ]
        },
        2: { // Power & Thickness (Güç & Kalınlık)
            id: 3,
            exercises: [
                { name: "Deadlift", sets: "5", reps: "5" },
                { name: "Barbell Row", sets: "4", reps: "8-10" },
                { name: "T-Bar Row", sets: "4", reps: "10" },
                { name: "Close Grip Pulldown", sets: "3", reps: "10-12" }
            ]
        }
    },
    legs: {
        0: { // Basic Legs
            id: 1,
            exercises: [
                { name: "Goblet Squats", sets: "3", reps: "12" },
                { name: "Leg Press", sets: "3", reps: "12-15" },
                { name: "Leg Extension", sets: "3", reps: "15" },
                { name: "Lying Leg Curl", sets: "3", reps: "15" }
            ]
        },
        1: { // Squat Focus
            id: 2,
            exercises: [
                { name: "Barbell Squat", sets: "5", reps: "5" },
                { name: "Front Squat", sets: "3", reps: "8-10" },
                { name: "Bulgarian Split Squat", sets: "3", reps: "10 each leg" },
                { name: "Calf Raises", sets: "4", reps: "20" }
            ]
        },
        2: { // Full Legs
            id: 3,
            exercises: [
                { name: "Barbell Squat", sets: "4", reps: "8-10" },
                { name: "Romanian Deadlift", sets: "4", reps: "10-12" },
                { name: "Leg Press", sets: "4", reps: "15" },
                { name: "Walking Lunges", sets: "3", reps: "20 steps" },
                { name: "Seated Calf Raise", sets: "4", reps: "15" }
            ]
        }
    },
    shoulders: {
        0: {
            id: 1,
            exercises: [
                { name: "Seated Dumbbell Press", sets: "3", reps: "10-12" },
                { name: "Lateral Raises", sets: "3", reps: "15" },
                { name: "Front Raises", sets: "3", reps: "12" }
            ]
        },
        1: {
            id: 2,
            exercises: [
                { name: "Overhead Barbell Press", sets: "4", reps: "6-8" },
                { name: "Arnold Press", sets: "3", reps: "10-12" },
                { name: "Cable Lateral Raise", sets: "4", reps: "15" },
                { name: "Upright Row", sets: "3", reps: "12" }
            ]
        },
        2: {
            id: 3,
            exercises: [
                { name: "Face Pulls", sets: "4", reps: "15-20" },
                { name: "Reverse Pec Deck", sets: "4", reps: "15" },
                { name: "Bent Over Lateral Raise", sets: "4", reps: "12" },
                { name: "Dumbbell Shoulder Press", sets: "3", reps: "10" }
            ]
        }
    },
    arms: {
        0: {
            id: 1,
            exercises: [
                { name: "Barbell Curl", sets: "3", reps: "12", note: "Superset with Tricep Pushdown" },
                { name: "Tricep Pushdown", sets: "3", reps: "12" },
                { name: "Hammer Curls", sets: "3", reps: "12" },
                { name: "Overhead Dumbbell Ext", sets: "3", reps: "12" }
            ]
        },
        1: {
            id: 2,
            exercises: [
                { name: "Close Grip Bench Press", sets: "4", reps: "8-10" },
                { name: "Weighted Dips", sets: "3", reps: "10" },
                { name: "Chin Ups", sets: "3", reps: "Failure" },
                { name: "Preacher Curls", sets: "3", reps: "12" }
            ]
        },
        2: {
            id: 3,
            exercises: [
                { name: "Skullcrushers", sets: "4", reps: "10-12" },
                { name: "Incline Dumbbell Curl", sets: "4", reps: "10-12" },
                { name: "Cable Kickbacks", sets: "3", reps: "15" },
                { name: "Concentration Curls", sets: "3", reps: "12" }
            ]
        }
    },
    abs: {
        0: {
            id: 1,
            exercises: [
                { name: "Crunches", sets: "3", reps: "20" },
                { name: "Leg Raises", sets: "3", reps: "15" },
                { name: "Plank", sets: "3", reps: "30-60 sec" }
            ]
        },
        1: {
            id: 2,
            exercises: [
                { name: "Hanging Leg Raise", sets: "4", reps: "12-15" },
                { name: "Cable Crunch", sets: "4", reps: "15" },
                { name: "Russian Twists", sets: "3", reps: "20 each side" }
            ]
        },
        2: {
            id: 3,
            exercises: [
                { name: "Ab Wheel Rollout", sets: "4", reps: "10-15" },
                { name: "Dragon Flags", sets: "3", reps: "Failure" },
                { name: "Weighted Plank", sets: "3", reps: "60 sec" }
            ]
        }
    },
    fullbody: {
        0: {
            id: 1,
            exercises: [
                { name: "Bodyweight Squats", sets: "3", reps: "15" },
                { name: "Push Ups", sets: "3", reps: "12" },
                { name: "Dumbbell Rows", sets: "3", reps: "12" },
                { name: "Plank", sets: "3", reps: "30 sec" }
            ]
        },
        1: {
            id: 2,
            exercises: [
                { name: "Kettlebell Swings", sets: "4", reps: "20" },
                { name: "Burpees", sets: "3", reps: "10" },
                { name: "Jump Squats", sets: "3", reps: "15" },
                { name: "Mountain Climbers", sets: "3", reps: "30 sec" }
            ]
        },
        2: {
            id: 3,
            exercises: [
                { name: "Deadlift", sets: "5", reps: "5" },
                { name: "Overhead Press", sets: "5", reps: "5" },
                { name: "Squat", sets: "5", reps: "5" },
                { name: "Pull Ups", sets: "3", reps: "Failure" }
            ]
        }
    },
    gym: {
        0: { // Machine Focus
            id: 1,
            exercises: [
                { name: "Leg Press", sets: "3", reps: "12" },
                { name: "Chest Press Machine", sets: "3", reps: "12" },
                { name: "Lat Pulldown Machine", sets: "3", reps: "12" },
                { name: "Shoulder Press Machine", sets: "3", reps: "12" }
            ]
        },
        1: { // Free Weight Volume
            id: 2,
            exercises: [
                { name: "Barbell Squat", sets: "4", reps: "8" },
                { name: "Bench Press", sets: "4", reps: "8" },
                { name: "Bent Over Row", sets: "4", reps: "10" },
                { name: "Military Press", sets: "4", reps: "8-10" }
            ]
        },
        2: { // Power 5x5
            id: 3,
            exercises: [
                { name: "Squat", sets: "5", reps: "5" },
                { name: "Bench Press", sets: "5", reps: "5" },
                { name: "Deadlift", sets: "1", reps: "5" },
                { name: "Overhead Press", sets: "5", reps: "5" }
            ]
        }
    },
    home: {
        0: { // No Equipment
            id: 1,
            exercises: [
                { name: "Bodyweight Squats", sets: "4", reps: "20" },
                { name: "Push Ups", sets: "4", reps: "Failure" },
                { name: "Lunges", sets: "3", reps: "15 each" },
                { name: "Plank", sets: "3", reps: "45 sec" }
            ]
        },
        1: { // Dumbbell Full Body
            id: 2,
            exercises: [
                { name: "Goblet Squats", sets: "4", reps: "12" },
                { name: "Dumbbell Floor Press", sets: "4", reps: "12" },
                { name: "Dumbbell Rows", sets: "4", reps: "12" },
                { name: "Dumbbell Thrusters", sets: "3", reps: "10" }
            ]
        },
        2: { // HIIT
            id: 3,
            exercises: [
                { name: "Burpees", sets: "4", reps: "30 sec on/30 off" },
                { name: "Mountain Climbers", sets: "4", reps: "30 sec on/30 off" },
                { name: "Jump Squats", sets: "4", reps: "30 sec on/30 off" },
                { name: "High Knees", sets: "4", reps: "30 sec on/30 off" }
            ]
        }
    },
    outdoor: {
        0: { // Park/Calisthenics
            id: 1,
            exercises: [
                { name: "Pull Ups", sets: "3", reps: "Failure" },
                { name: "Dips", sets: "3", reps: "Failure" },
                { name: "Push Ups", sets: "3", reps: "20" },
                { name: "Hanging Leg Raise", sets: "3", reps: "15" }
            ]
        },
        1: { // Run & Condition
            id: 2,
            exercises: [
                { name: "Jogging Warmup", sets: "1", reps: "10 min" },
                { name: "Sprints", sets: "10", reps: "100m" },
                { name: "Walking Lunges", sets: "3", reps: "50m" },
                { name: "Cool Down Walk", sets: "1", reps: "10 min" }
            ]
        },
        2: { // Bodyweight Circuit
            id: 3,
            exercises: [
                { name: "Park Bench Step Ups", sets: "3", reps: "15 each" },
                { name: "Incline Push Ups (Bench)", sets: "3", reps: "20" },
                { name: "Bulgarian Split Squat (Bench)", sets: "3", reps: "10 each" },
                { name: "Bench Dips", sets: "3", reps: "15" }
            ]
        }
    }
};

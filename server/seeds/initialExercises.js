const initialExercises = [
  // CHEST
  {
    name: 'Barbell Bench Press',
    category: 'Strength',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Shoulders', 'Arms'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Lie flat on bench with feet pressed firmly on the ground.',
      'Grip the bar slightly wider than shoulder-width.',
      'Lower bar slowly to mid-chest while keeping wrists straight.',
      'Press up explosively back to starting position without locking elbows.'
    ],
    tips: ['Keep shoulder blades retracted throughout movement.', 'Do not bounce bar off chest.']
  },
  {
    name: 'Incline Dumbbell Press',
    category: 'Strength',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Shoulders', 'Arms'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    instructions: [
      'Set bench to a 30-45 degree angle.',
      'Hold dumbbells at shoulder height with palms forward.',
      'Press dumbbells overhead until arms are extended.',
      'Slowly lower dumbbells back to chest level.'
    ],
    tips: ['Avoid overarching your lower back.', 'Maintain steady tempo.']
  },
  {
    name: 'Push-Up',
    category: 'Bodyweight',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Core', 'Arms', 'Shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Start in a high plank position with hands slightly wider than shoulders.',
      'Lower body until chest nearly touches the floor.',
      'Push back up through palms while maintaining a rigid core.'
    ],
    tips: ['Keep hips level with spine; do not sag hips.']
  },
  {
    name: 'Cable Chest Fly',
    category: 'Strength',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Shoulders'],
    equipment: 'Cable',
    difficulty: 'Intermediate',
    instructions: [
      'Set pulleys at shoulder height and take a step forward in split stance.',
      'Bring handles together in front of chest in a hugging motion.',
      'Slowly reverse movement until mild stretch in chest.'
    ],
    tips: ['Keep a slight bend in elbows throughout movement.']
  },
  {
    name: 'Dips (Chest Focus)',
    category: 'Bodyweight',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Arms', 'Shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    instructions: [
      'Grip parallel bars and elevate body.',
      'Lean torso slightly forward at 30 degrees.',
      'Lower body until elbows are at roughly 90 degrees.',
      'Push back up through chest.'
    ],
    tips: ['Avoid shrugging shoulders near ears.']
  },

  // BACK
  {
    name: 'Barbell Deadlift',
    category: 'Strength',
    muscleGroup: 'Back',
    secondaryMuscles: ['Legs', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Advanced',
    instructions: [
      'Stand with feet hip-width under barbell.',
      'Hinge at hips, grip bar with neutral spine.',
      'Drive through heels and extend hips and knees simultaneously.',
      'Lock out at the top with glutes squeezed, then return bar under control.'
    ],
    tips: ['Keep bar close to shins throughout pull.']
  },
  {
    name: 'Pull-Up',
    category: 'Bodyweight',
    muscleGroup: 'Back',
    secondaryMuscles: ['Arms', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    instructions: [
      'Hang from bar with overhand grip wider than shoulders.',
      'Engage lats and pull chest towards the bar.',
      'Lower yourself down until arms are fully extended.'
    ],
    tips: ['Avoid swinging or kipping legs.']
  },
  {
    name: 'Barbell Bent-Over Row',
    category: 'Strength',
    muscleGroup: 'Back',
    secondaryMuscles: ['Arms', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Hinge hips back with torso around 45 degrees, back straight.',
      'Pull bar towards lower ribcage/navel.',
      'Squeeze shoulder blades together, then lower under control.'
    ],
    tips: ['Do not jerk upper body to lift weight.']
  },
  {
    name: 'Lat Pulldown',
    category: 'Strength',
    muscleGroup: 'Back',
    secondaryMuscles: ['Arms'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    instructions: [
      'Sit facing machine with knees secured under pads.',
      'Grip wide bar with overhand grip.',
      'Pull bar down towards upper chest while leaning slightly back.',
      'Return bar smoothly to top position.'
    ],
    tips: ['Drive elbows straight down and back.']
  },
  {
    name: 'Seated Cable Row',
    category: 'Strength',
    muscleGroup: 'Back',
    secondaryMuscles: ['Arms', 'Shoulders'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    instructions: [
      'Sit upright with feet on footplates and knees slightly bent.',
      'Pull handle towards abdomen, squeezing shoulder blades.',
      'Extend arms slowly back to starting position.'
    ],
    tips: ['Keep chest lifted and spine neutral.']
  },

  // LEGS
  {
    name: 'Barbell Back Squat',
    category: 'Strength',
    muscleGroup: 'Legs',
    secondaryMuscles: ['Core', 'Back'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Rest barbell securely on upper traps.',
      'Stand feet shoulder-width, toes slightly flared.',
      'Break at hips and knees, descending until thighs are parallel or below.',
      'Drive upwards through midfoot back to standing.'
    ],
    tips: ['Keep chest upright and knees tracking over toes.']
  },
  {
    name: 'Romanian Deadlift (RDL)',
    category: 'Strength',
    muscleGroup: 'Legs',
    secondaryMuscles: ['Back', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Hold bar at hip level with soft bend in knees.',
      'Push hips directly back while gliding bar down shins.',
      'Lower until hamstrings feel stretched, then drive hips forward.'
    ],
    tips: ['Do not round lower back; movement is a pure hip hinge.']
  },
  {
    name: 'Leg Press',
    category: 'Strength',
    muscleGroup: 'Legs',
    secondaryMuscles: ['Legs'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    instructions: [
      'Sit comfortably on machine with feet shoulder-width on plate.',
      'Release safety handles and lower platform slowly toward chest.',
      'Press platform away until legs are almost fully extended.'
    ],
    tips: ['Never lock knees violently at top of press.']
  },
  {
    name: 'Walking Dumbbell Lunge',
    category: 'Strength',
    muscleGroup: 'Legs',
    secondaryMuscles: ['Core'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    instructions: [
      'Hold dumbbells at sides, step forward into a lunge position.',
      'Lower back knee toward floor until both knees reach 90 degrees.',
      'Step forward into next lunge alternating legs.'
    ],
    tips: ['Maintain upright posture throughout stride.']
  },
  {
    name: 'Standing Calf Raise',
    category: 'Strength',
    muscleGroup: 'Legs',
    secondaryMuscles: [],
    equipment: 'Machine',
    difficulty: 'Beginner',
    instructions: [
      'Place balls of feet on platform ledge with heels hanging.',
      'Raise heels as high as possible, contracting calves.',
      'Lower heels below platform edge for deep stretch.'
    ],
    tips: ['Pause for 1 second at top contraction.']
  },

  // SHOULDERS
  {
    name: 'Overhead Barbell Military Press',
    category: 'Strength',
    muscleGroup: 'Shoulders',
    secondaryMuscles: ['Arms', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Hold bar at collarbone height with elbows under wrists.',
      'Press barbell straight up overhead until locked out.',
      'Lower barbell back down under control to upper chest.'
    ],
    tips: ['Tuck chin back briefly as bar passes face.']
  },
  {
    name: 'Dumbbell Lateral Raise',
    category: 'Strength',
    muscleGroup: 'Shoulders',
    secondaryMuscles: [],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    instructions: [
      'Stand holding dumbbells at sides with slight elbow bend.',
      'Raise arms laterally until elbows reach shoulder height.',
      'Slowly lower dumbbells back down.'
    ],
    tips: ['Lead with elbows, not wrists. Avoid momentum swinging.']
  },
  {
    name: 'Face Pull',
    category: 'Strength',
    muscleGroup: 'Shoulders',
    secondaryMuscles: ['Back'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    instructions: [
      'Attach rope to high pulley on cable machine.',
      'Pull rope towards forehead, rotating hands backwards.',
      'Squeeze rear deltoids and upper back, then release slowly.'
    ],
    tips: ['Excellent for posture and rotator cuff health.']
  },

  // ARMS
  {
    name: 'Barbell Bicep Curl',
    category: 'Strength',
    muscleGroup: 'Arms',
    secondaryMuscles: [],
    equipment: 'Barbell',
    difficulty: 'Beginner',
    instructions: [
      'Hold bar with underhand grip, arms extended.',
      'Curl bar up toward chest while keeping elbows pinned to sides.',
      'Lower bar slowly back to starting position.'
    ],
    tips: ['Avoid leaning backwards or swinging hips.']
  },
  {
    name: 'Tricep Rope Pushdown',
    category: 'Strength',
    muscleGroup: 'Arms',
    secondaryMuscles: [],
    equipment: 'Cable',
    difficulty: 'Beginner',
    instructions: [
      'Attach rope to high cable, grip ends with palms facing each other.',
      'Push rope downward, spreading ends apart at the bottom.',
      'Slowly return to 90 degrees elbow bend.'
    ],
    tips: ['Keep upper arms stationary at ribcage.']
  },
  {
    name: 'Skull Crusher (Lying Triceps Extension)',
    category: 'Strength',
    muscleGroup: 'Arms',
    secondaryMuscles: [],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Lie on bench holding EZ bar straight up over shoulders.',
      'Bending only at elbows, lower bar towards forehead.',
      'Extend arms back up to starting position.'
    ],
    tips: ['Keep elbows tucked in, do not let them flare wide.']
  },
  {
    name: 'Incline Dumbbell Hammer Curl',
    category: 'Strength',
    muscleGroup: 'Arms',
    secondaryMuscles: [],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    instructions: [
      'Sit on incline bench holding dumbbells with neutral palms.',
      'Curl dumbbells up while keeping palms facing each other.',
      'Lower weights under steady control.'
    ],
    tips: ['Maximizes bicep long head and brachialis activation.']
  },

  // CORE
  {
    name: 'Plank',
    category: 'Bodyweight',
    muscleGroup: 'Core',
    secondaryMuscles: ['Shoulders', 'Back'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Rest on forearms and toes with body in a straight line.',
      'Engage core, glutes, and quadriceps firmly.',
      'Hold position without letting hips sag or pike.'
    ],
    tips: ['Breathe steadily throughout the hold duration.']
  },
  {
    name: 'Hanging Leg Raise',
    category: 'Bodyweight',
    muscleGroup: 'Core',
    secondaryMuscles: ['Legs'],
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    instructions: [
      'Hang from pull-up bar with overhand grip.',
      'Raise straight legs up until parallel with floor or higher.',
      'Lower legs under control without swinging.'
    ],
    tips: ['Tilt pelvis upward at top to engage lower abdominals.']
  },
  {
    name: 'Cable Woodchopper',
    category: 'Strength',
    muscleGroup: 'Core',
    secondaryMuscles: ['Shoulders'],
    equipment: 'Cable',
    difficulty: 'Intermediate',
    instructions: [
      'Set cable high, grasp handle with both hands in athletic stance.',
      'Rotate torso diagonally downward across opposite knee.',
      'Return smoothly to starting position.'
    ],
    tips: ['Pivot on rear foot and engage obliques.']
  },
  {
    name: 'Ab Roller Wheel Rollout',
    category: 'Bodyweight',
    muscleGroup: 'Core',
    secondaryMuscles: ['Back', 'Arms'],
    equipment: 'Other',
    difficulty: 'Advanced',
    instructions: [
      'Kneel on floor holding ab wheel handles.',
      'Roll wheel forward, extending body as far as possible without back sagging.',
      'Use abdominals to pull wheel back toward knees.'
    ],
    tips: ['Maintain posterior pelvic tilt to protect spine.']
  },

  // CARDIO & HIIT
  {
    name: 'Treadmill Interval Running',
    category: 'HIIT',
    muscleGroup: 'Cardio',
    secondaryMuscles: ['Legs'],
    equipment: 'Cardio Machine',
    difficulty: 'Intermediate',
    instructions: [
      'Warm up with 3 minutes easy jog.',
      'Alternate 30 seconds sprint (speed 14-18 km/h) with 60 seconds walking recovery.',
      'Repeat for 8-12 rounds and cool down.'
    ],
    tips: ['Maintain upright running form and strike on midfoot.']
  },
  {
    name: 'Rowing Machine (Ergometer)',
    category: 'Cardio',
    muscleGroup: 'Full Body',
    secondaryMuscles: ['Back', 'Legs', 'Arms'],
    equipment: 'Cardio Machine',
    difficulty: 'Intermediate',
    instructions: [
      'Secure feet in straps, grasp handle with neutral wrists.',
      'Drive through legs first, lean back slightly, then pull handle to lower ribs.',
      'Reverse arms, torso hinge, then bend knees back to catch.'
    ],
    tips: ['60% leg drive, 20% core swing, 20% arm pull.']
  },
  {
    name: 'Burpees',
    category: 'HIIT',
    muscleGroup: 'Full Body',
    secondaryMuscles: ['Chest', 'Legs', 'Cardio'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    instructions: [
      'From standing, drop into squat and place hands on floor.',
      'Kick feet back into plank, perform a push-up.',
      'Jump feet back in and jump explosively into air with hands overhead.'
    ],
    tips: ['Pace breathing to maintain stamina throughout set.']
  },
  {
    name: 'Jump Rope (Speed Skipping)',
    category: 'Cardio',
    muscleGroup: 'Cardio',
    secondaryMuscles: ['Legs', 'Arms'],
    equipment: 'None',
    difficulty: 'Beginner',
    instructions: [
      'Hold rope handles at waist level with elbows close to torso.',
      'Turn rope with wrists, jumping 1-2 inches off balls of feet.',
      'Maintain rhythmic cadence.'
    ],
    tips: ['Keep jumps low to conserve energy and reduce joint impact.']
  },
  {
    name: 'Kettlebell Swing',
    category: 'HIIT',
    muscleGroup: 'Full Body',
    secondaryMuscles: ['Legs', 'Back', 'Core'],
    equipment: 'Kettlebell',
    difficulty: 'Intermediate',
    instructions: [
      'Stand with feet wider than shoulders, kettlebell slightly forward.',
      'Hinge hips back and hike kettlebell between legs.',
      'Snap hips forward explosively, driving bell to chest height.'
    ],
    tips: ['Power comes from hips and glutes, not shoulders or arms.']
  }
];

module.exports = initialExercises;

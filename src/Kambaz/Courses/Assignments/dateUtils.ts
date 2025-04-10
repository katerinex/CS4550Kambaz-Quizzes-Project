// src/Kambaz/Courses/Assignments/dateUtils.ts

/**
 * Format a date for display in the UI
 * 
 * @param dateString ISO date string to format
 * @param options Formatting options
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string | undefined,
  options: {
    includeTime?: boolean,
    includeYear?: boolean
  } = {}
) => {
  if (!dateString) return "No date";

  const { includeTime = true, includeYear = true } = options;

  try {
    const date = new Date(dateString);
    const formatOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };

    if (includeYear) {
      formatOptions.year = 'numeric';
    }

    if (includeTime) {
      formatOptions.hour = '2-digit';
      formatOptions.minute = '2-digit';
    }

    return date.toLocaleDateString('en-US', formatOptions);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

/**
 * Check if an assignment is published and available based on dates
 * 
 * @param assignment Assignment to check
 * @returns Availability status object
 */
export const getAssignmentAvailability = (assignment: any) => {
  const now = new Date();
  const status = {
    isPublished: Boolean(assignment.published),
    isAvailable: false,
    message: ""
  };

  if (!status.isPublished) {
    status.message = "Not published";
    return status;
  }

  // Check available from date
  if (assignment.availableFromDate) {
    const availableFrom = new Date(assignment.availableFromDate);
    if (availableFrom > now) {
      status.message = `Available from ${formatDate(assignment.availableFromDate)}`;
      return status;
    }
  }

  // Check available until date
  if (assignment.availableUntilDate) {
    const availableUntil = new Date(assignment.availableUntilDate);
    if (availableUntil < now) {
      status.message = "No longer available";
      return status;
    }
  }

  // If we got here, the assignment is available
  status.isAvailable = true;
  status.message = "Available";
  
  // Add due date info if applicable
  if (assignment.dueDate) {
    const dueDate = new Date(assignment.dueDate);
    if (dueDate < now) {
      status.message = "Past due";
    } else {
      // Calculate days until due
      const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue <= 7) {
        status.message = `Due in ${daysUntilDue} ${daysUntilDue === 1 ? 'day' : 'days'}`;
      }
    }
  }

  return status;
};

/**
 * Shifts dates of assignments by a specified time period
 * 
 * @param assignments Array of assignments to modify
 * @param amount Amount to shift by (positive = later, negative = earlier)
 * @param unit Unit of time ('days', 'weeks', 'months')
 * @param options Configuration options for the shift
 * @returns Array of updated assignments
 */
export const shiftAssignmentDates = (
  assignments: any[],
  amount: number,
  unit: 'days' | 'weeks' | 'months',
  options: {
    shiftDueDates?: boolean,
    shiftAvailabilityDates?: boolean,
    startDate?: Date | null,
    endDate?: Date | null,
    onlyWithDueDates?: boolean
  } = {}
) => {
  // Set default options
  const {
    shiftDueDates = true,
    shiftAvailabilityDates = true,
    startDate = null,
    endDate = null,
    onlyWithDueDates = false
  } = options;

  // Calculate milliseconds to shift
  let millisToShift = 0;
  switch (unit) {
    case 'days':
      millisToShift = amount * 24 * 60 * 60 * 1000;
      break;
    case 'weeks':
      millisToShift = amount * 7 * 24 * 60 * 60 * 1000;
      break;
    case 'months':
      // For months, we'll use a simple 30-day approximation
      millisToShift = amount * 30 * 24 * 60 * 60 * 1000;
      break;
  }

  // Filter assignments that meet criteria
  const assignmentsToUpdate = assignments.filter(assignment => {
    // Skip assignments without due dates if onlyWithDueDates is true
    if (onlyWithDueDates && !assignment.dueDate) {
      return false;
    }

    // If date range is specified, only include assignments with due dates in range
    if (startDate && endDate && assignment.dueDate) {
      const dueDate = new Date(assignment.dueDate);
      return dueDate >= startDate && dueDate <= endDate;
    }

    return true;
  });

  // Update the assignments with shifted dates
  return assignmentsToUpdate.map(assignment => {
    const updatedAssignment = { ...assignment };

    // Shift due date if requested
    if (shiftDueDates && assignment.dueDate) {
      const dueDate = new Date(assignment.dueDate);
      dueDate.setTime(dueDate.getTime() + millisToShift);
      updatedAssignment.dueDate = dueDate.toISOString();
    }

    // Shift availability dates if requested
    if (shiftAvailabilityDates) {
      if (assignment.availableFromDate) {
        const availableFromDate = new Date(assignment.availableFromDate);
        availableFromDate.setTime(availableFromDate.getTime() + millisToShift);
        updatedAssignment.availableFromDate = availableFromDate.toISOString();
      }

      if (assignment.availableUntilDate) {
        const availableUntilDate = new Date(assignment.availableUntilDate);
        availableUntilDate.setTime(availableUntilDate.getTime() + millisToShift);
        updatedAssignment.availableUntilDate = availableUntilDate.toISOString();
      }
    }

    return updatedAssignment;
  });
};
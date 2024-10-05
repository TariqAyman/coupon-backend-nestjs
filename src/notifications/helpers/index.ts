const fcmTopicPAttern = /^[a-zA-Z0-9-_.~%]+$/;

export const checkFCMTopicPattern = (pattern: string): boolean => {
  const isMatch: boolean = fcmTopicPAttern.test(pattern);
  return isMatch;
};

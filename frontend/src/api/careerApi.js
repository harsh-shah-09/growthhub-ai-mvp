import axiosClient from './axiosClient';

export const careerApi = {
  // Fetch Jobs
  getJobs: async (skip = 0, limit = 10) => {
    const response = await axiosClient.get(`/career/jobs?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Fetch Internships
  getInternships: async (skip = 0, limit = 10) => {
    const response = await axiosClient.get(`/career/internships?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Fetch Coding Challenges
  getChallenges: async (difficulty = '', skip = 0, limit = 10) => {
    const response = await axiosClient.get(`/career/challenges?difficulty=${difficulty}&skip=${skip}&limit=${limit}`);
    return response.data;
  }
};
import Axios from "axios";
const baseUrl = "https://fso-build.onrender.com/api/persons";

const getAll = () => {
  return Axios.get(baseUrl).then((response) => response.data);
};
const updatePerson = (id, newObject) => {
  return Axios.put(`${baseUrl}/${id}`, newObject).then(
    (response) => response.data,
  );
};
const addPerson = (newObject) => {
  return Axios.post(baseUrl, newObject).then((response) => response.data);
};

const deletePerson = (id) => {
  return Axios.delete(`${baseUrl}/${id}`).then((response) => response.data);
};
export default { getAll, updatePerson, addPerson, deletePerson };

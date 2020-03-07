import request from 'request-promise';

let officer_id: string;
let caseId: string;

const policeRouteUrl = 'http://localhost:3000/police/';
const privateCitizenRoute = 'http://localhost:3000/privateCitizen/';

const caseInput = {
  title: 'stolenBike',
  brand: 'BMX',
  city: 'MALMO',
  description: 'stolen Bike in Malmo',
  image: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
};


const token = '566515d6-5f12-11ea-bc55-0242ac130003';

describe('Testing private citizen Methods', () => {
  it('should fetch all cases exist in db', () => request({
    method: 'GET',
    uri: `${privateCitizenRoute}cases`,
  }).then((res) => {
    const response = JSON.parse(res);
    expect(res).toBeTruthy();
    expect(res).not.toBeNull();
    expect(typeof response).toBe('object');
    expect(response).toHaveProperty('data');
    expect(response.data).toHaveProperty('cases');
    expect(Array.isArray(response.data.cases)).toBe(true);
  }));

  it('should post case and assign police officer if exist', () => request({
    method: 'POST',
    uri: `${privateCitizenRoute}report`,
    body: caseInput,
    json: true,
  }).then((response) => {
    expect(response).toBeTruthy();
    expect(response).not.toBeNull();
    expect(typeof response).toBe('object');
    expect(response).toHaveProperty('data');
    expect(response.data).toHaveProperty('case');
    expect(typeof response.data.case).toBe('object');
    caseId = response.data.case.id;
  }));


  it('should fetch all cases exist in db', () => request({
    method: 'GET',
    uri: `${policeRouteUrl}cases`,
  }).then((res) => {
    const response = JSON.parse(res);
    expect(res).toBeTruthy();
    expect(res).not.toBeNull();
    expect(typeof response).toBe('object');
    expect(response).toHaveProperty('data');
    expect(response.data).toHaveProperty('cases');
    expect(Array.isArray(response.data.cases)).toBe(true);
  }));

  it('should authorize and add officer', () => request({
    method: 'POST',
    uri: `${policeRouteUrl}addOfficer`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: { name: 'test officer' },
    json: true,
  }).then((response) => {
    expect(response).toBeTruthy();
    expect(response).not.toBeNull();
    expect(typeof response).toBe('object');
    expect(response).toHaveProperty('data');
    expect(response.data).toHaveProperty('newOfficer');
    expect(response.data.newOfficer).toHaveProperty('id');
    expect(response.data.newOfficer.name).toBe('test officer');
    officer_id = response.data.newOfficer.id;
  }));


  it('should authorize and update officer', () => request({
    method: 'PATCH',
    uri: `${policeRouteUrl}updateOfficer/${String(officer_id)}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: { name: 'test officer updated' },
    json: true,
  }).then((response) => {
    expect(response).toBeTruthy();
    expect(response).not.toBeNull();
    expect(typeof response).toBe('object');
    expect(response).toHaveProperty('data');
    expect(response.data).toHaveProperty('id');
    expect(response.data.id).toBe(officer_id);
    expect(response.data.name).toBe('test officer updated');
  }));

  it('should solve case and free officer', () => request({
    method: 'PATCH',
    uri: `${policeRouteUrl}solve/${String(caseId)}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    const response = JSON.parse(res);
    expect(response).toBeTruthy();
    expect(response).not.toBeNull();
    expect(typeof response).toBe('object');
    expect(response).toHaveProperty('data');
    expect(typeof response.data).toBe('object');
    expect(response.data).toHaveProperty('id');
  }));


  it('should authorize and delete officer', () => request({
    method: 'DELETE',
    uri: `${policeRouteUrl}deleteOfficer/${String(officer_id)}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    const response = JSON.parse(res);
    expect(response).toBeTruthy();
    expect(response).not.toBeNull();
    expect(typeof response).toBe('object');
    expect(response).toHaveProperty('data');
    expect(response.data).toHaveProperty('message');
    expect(response.data.message).toBe(`Successfully deleted officer wit id ${officer_id}`);
  }));
});

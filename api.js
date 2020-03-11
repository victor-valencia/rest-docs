module.exports = {

  base: '/api',
  routes: [
    {
      // Doctors ['GET']
      table: 'doctors',
      event: 'DOCTOR',
      methods: ['GET'],
      columns: [
          {name: 'id', primary: true},
          {name: 'name'},
          {name: 'specialty'},
          {name: 'address'},
          {name: 'photo'}
      ]
    },
    {
      // Patients ['GET']
      table: 'patients',
      event: 'PATIENT',
      methods: ['GET'],
      columns: [
          {name: 'id', primary: true},
          {name: 'nombre'},
          {name: 'photo'},
          {name: 'email'},
          {name: 'phone'}          
      ]
    },
    {
      // Appointments ['GET', 'POST', 'PUT', 'DELETE']
      table: 'appointments',
      view: 'vw_appointments',
      event: 'APPOINTMENT',
      columns: [
          {name: 'id', primary: true},
          {name: 'patient_id'},
          {name: 'doctor_id'},
          {name: 'date'},
          {name: 'time'},
          {name: 'condition'}
      ]
    },
    {
      // Quotes ['GET', 'POST', 'PUT', 'DELETE']
      table: 'quotes',
      view: 'vw_quotes',
      event: 'QUOTE',
      columns: [
          {name: 'id', primary: true},
          {name: 'patient_id'},
          {name: 'date'},
          {name: 'description'}
      ]
    },
    {
      // Requests ['GET', 'POST', 'PUT', 'DELETE']
      table: 'requests',
      view: 'vw_requests',
      event: 'REQUEST',
      columns: [
          {name: 'id', primary: true},
          {name: 'patient_id'},
          {name: 'doctor_id'},
          {name: 'date'},
          {name: 'time'},
          {name: 'address'}
      ]
    }
  ]
}
module.exports = {

  base: '/api/',
  routes: [
    {
      // Médicos ['GET']
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
      // Pacientes ['GET']
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
      // Citas médicas ['GET', 'POST', 'PUT', 'DELETE']
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
      // Cotización de servicios ['GET', 'POST', 'PUT', 'DELETE']
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
      // Solicitud de médico ['GET', 'POST', 'PUT', 'DELETE']
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
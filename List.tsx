// src/Kambaz/Courses/Quizzes/List.tsx
import { Link, useParams } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
//import { quizzes } from '../../Database/quizzes';
import quizzes from '../../Database/quizzes.json';

export default function QuizList() {
  const { cid } = useParams();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Quizzes</h3>
        <Link to={`/Kambaz/Courses/${cid}/Quizzes/new`}>
          <Button variant="primary">Create Quiz</Button>
        </Link>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Points</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map(quiz => (
            <tr key={quiz._id}>
              <td>{quiz.title}</td>
              <td>{quiz.quizType.replace('_', ' ')}</td>
              <td>{quiz.points}</td>
              <td>{new Date(quiz.dueDate).toLocaleDateString()}</td>
              <td>
                <Link to={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`}>
                  <Button variant="link" size="sm">View</Button>
                </Link>
                <Link to={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/edit`}>
                  <Button variant="link" size="sm">Edit</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

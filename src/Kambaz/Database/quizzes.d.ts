import { Quiz } from "../../types/types"; // Correct relative path

declare module './quizzes' { // Or declare module '../quizzes' if quizzes.json is one directory up
    const quizzes: Quiz[];
    export default quizzes;
}
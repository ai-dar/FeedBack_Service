import express from 'express';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import feedbackRoutes from './modules/feedback/feedback.routes';
import voteRoutes from './modules/vote/vote.routes';
import referenceRoutes from './modules/reference/reference.routes';

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/feedbacks', feedbackRoutes);
app.use('/votes', voteRoutes);
app.use('/references', referenceRoutes);

export default app;

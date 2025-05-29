import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export async function DELETE(
  req: NextRequest,
  context: { params: { messageid: string } }
) {
  const { messageid } = context.params;

  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const result = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageid } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Message deleted' }, { status: 200 });
  } catch (err) {
    console.error('Error deleting message:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

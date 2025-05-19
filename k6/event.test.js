import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    vus: 1000,
    duration: '5s',
};

export default function () {
    const eventId = '682aca336faac935e48eb150';
    const accessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODJhYzljNGQ4NGMyYzQwN2YxZjRmMWQiLCJlbWFpbCI6InVzZXIxQG5leG9uLmNvbSIsInJvbGUiOjAsInR5cGUiOiJhY2Nlc3MiLCJ0b2tlblZlcnNpb24iOjAsImlhdCI6MTc0NzYzODc0MCwiZXhwIjoxNzQ3NjQyMzQwfQ.SfVHNAcEyxF-jDQ5cS6E7_nNKMLuc_zRjsD5_XSotYA';
    const url = `http://localhost:3000/event/${eventId}/participate`;

    const payload = JSON.stringify({
        rewardType: 'MAPLE_POINT',
    });

    const params = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    };

    const res = http.post(url, payload, params);

    check(res, {
        '응답 코드가 200인가?': r => r.status === 200 || r.status === 201,
        '이벤트 참여 성공 여부': r => r.json().data.status === 'SUCCESS',
    });

    sleep(1);
}

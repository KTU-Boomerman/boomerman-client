function lerp(start: number, end: number, time: number): number {
  return start * (1 - time) + end * time;
}

// if (time_since_last_frame <= lerp_time_factor) { // use linear interpolation
//     position = lerp(position, server_updated_position, time_since_last_frame / lerp_time_factor);
// } else { // do not use linear interpolation
//     position = server_updated_position;
// }
